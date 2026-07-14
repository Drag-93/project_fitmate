import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

// TipTap 관련 임포트
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

// ---- 에디터 상단 툴바 ----
const EditorToolbar = ({ editor, onImageClick }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        굵게
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        밑줄
      </button>
      <button type="button" onClick={onImageClick}>
        이미지
      </button>
    </div>
  );
};

const CommunityUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState([]);
  const [category, setCategory] = useState([]);
  const [community, setCommunity] = useState({
    title: "",
    content: "",
    tabId: "",
    categoryId: "",
    attachFile: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // TipTap 에디터 설정
  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: "",
    onUpdate: ({ editor }) => {
      setCommunity((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // 데이터 로드 후 에디터 내용 세팅
  useEffect(() => {
    if (editor && community.content && !editor.isDestroyed) {
      // 이미 내용이 있다면 무한루프 방지를 위해 체크
      if (editor.getHTML() !== community.content) {
        editor.commands.setContent(community.content);
      }
    }
  }, [community.content, editor]);

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file || !editor) return;

      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const res = await jwtAxios.post(
          `${API_SERVER_URL}/api/upload/image`,
          uploadData,
        );
        const displayUrl = `${API_SERVER_URL}${res.data.url}`;
        editor.chain().focus().setImage({ src: displayUrl }).run();
      } catch (err) {
        console.error("이미지 업로드 실패", err);
      }
    };
  }, [editor]);

  // 게시글 데이터 페치
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tabRes, catRes, detailRes] = await Promise.all([
          axios.get(`${API_SERVER_URL}/community/tabList`),
          axios.get(`${API_SERVER_URL}/community/category`),
          jwtAxios.get(`${API_SERVER_URL}/community/detail/${id}`),
        ]);
        setTab(tabRes.data.result);
        setCategory(catRes.data.result);
        setCommunity(detailRes.data.community);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 수정 요청
  const getCommunityUpdate = async (e) => {
    e.preventDefault();
    try {
      await jwtAxios.put(`${API_SERVER_URL}/community/update/${id}`, community);
      alert("수정되었습니다.");
      navigate(`/community/detail/${id}`);
    } catch (error) {
      alert("수정 실패");
    }
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setCommunity((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="communityUpdate">
      <h1>게시글 수정</h1>
      <form onSubmit={getCommunityUpdate}>
        <div className="form-group">
          <label>작성자</label>
          <input name="userName" value={community.userName} readOnly />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            placeholder="제목을 입력하세요"
            value={community.title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="tiptap-wrapper">
          <EditorToolbar editor={editor} onImageClick={handleImageUpload} />
          <EditorContent editor={editor} className="tiptap-content" />
        </div>

        <button type="submit">수정</button>
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>
      </form>
    </div>
  );
};

export default CommunityUpdate;
