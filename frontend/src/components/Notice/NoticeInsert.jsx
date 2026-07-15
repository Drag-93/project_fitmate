import { useEffect, useState, useMemo, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";

// ---- 에디터 상단 툴바 (Quill과 달리 직접 만들어야 함) ----
const EditorToolbar = ({ editor, onImageClick }) => {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <select
        onChange={(e) => {
          const level = Number(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
        defaultValue={0}
      >
        <option value={0}>본문</option>
        <option value={1}>제목 1</option>
        <option value={2}>제목 2</option>
        <option value={3}>제목 3</option>
      </select>

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

const CommunityInsert = () => {
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [formData, setFormData] = useState({
    tabId: "",
    categoryId: "",
    title: "",
    content: "",
    userName: "",
    userEmail: "",
  });

  // ---- TipTap 에디터 초기화 ----
  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: "",
    // 내용이 바뀔 때마다 formData.content에 HTML 동기화
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // ---- 이미지 업로드 핸들러 (서버 업로드 후 URL만 삽입) ----
  const handleImageUpload = useCallback(() => {
    if (!editor) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const res = await jwtAxios.post(
          `${API_SERVER_URL}/api/upload/image`,
          uploadData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        const imageUrl = res.data.url; // 예: "/upload/community/xxx.jpg" (상대경로)
        const absoluteImageUrl = `${API_SERVER_URL}${imageUrl}`; // 절대경로로 변환

        // TipTap 방식: setImage 커맨드로 삽입
        editor.chain().focus().setImage({ src: absoluteImageUrl }).run();
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    };
  }, [editor]);

  // ---- 초기 데이터 로드 (탭, 카테고리, 유저 정보) ----
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tabRes, catRes] = await Promise.all([
          axios.get(`${API_SERVER_URL}/community/tabList`),
          axios.get(`${API_SERVER_URL}/community/category`),
        ]);
        setTabs(tabRes.data.result);
        setCategories(catRes.data.result);
        await getUser();
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const member = getCookie("member");
    if (!member) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/auth/login");
    }
  }, [navigate]);

  //작성자 정보 가져오기
  const getUser = async () => {
    try {
      const res = await jwtAxios.get(`${API_SERVER_URL}/api/member/detail`);
      if (res.data?.result) {
        setFormData((prev) => ({
          ...prev,
          userName: res.data.result.userName,
          userEmail: res.data.result.userEmail,
        }));
      }
    } catch (error) {
      console.error("회원 정보를 불러올 수 없습니다.", error);
    }
  };

  // ---- 탭 선택 시 하위 카테고리 필터링 ----
  const filteredCategories = useMemo(() => {
    if (!selectedTabId) return [];
    return categories.filter(
      (cat) => String(cat.tabId) === String(selectedTabId),
    );
  }, [selectedTabId, categories]);

  // ---- 입력값 변경 처리 ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tabId") {
      setSelectedTabId(value);
      setFormData((prev) => ({ ...prev, [name]: value, categoryId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));
  };

  // ---- 작성 완료 (제출) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tabId || !formData.categoryId) {
      alert("탭과 카테고리를 선택해주세요.");
      return;
    }
    if (!formData.title?.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      await jwtAxios.post(`${API_SERVER_URL}/community/insert`, formData);
      alert("작성 완료!");
      navigate("/community/communityList");
    } catch (err) {
      console.error("작성 실패", err);
      alert("작성 실패");
    }
  };

  return (
    <div className="community-insert-container">
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit} className="insert-form">
        <div className="form-group">
          <label>탭 선택</label>
          <select name="tabId" value={formData.tabId} onChange={handleChange}>
            <option value="">탭을 선택하세요</option>
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.tabName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>카테고리 선택</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">카테고리를 선택하세요</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>작성자</label>
          <input name="userName" value={formData.userName} readOnly />
        </div>

        <input
          name="title"
          placeholder="제목을 입력하세요"
          value={formData.title}
          onChange={handleTitleChange}
        />

        {/* ---- TipTap 에디터: 툴바 + 편집 영역을 각각 렌더링해야 함 ---- */}
        <div className="tiptap-wrapper">
          <EditorToolbar editor={editor} onImageClick={handleImageUpload} />
          <EditorContent editor={editor} className="tiptap-content" />
        </div>

        <button type="submit" className="submit-btn">
          글 작성하기
        </button>
      </form>
    </div>
  );
};

export default CommunityInsert;
