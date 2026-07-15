import { useEffect, useState, useMemo, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";

// ---- 에디터 상단 툴바 ----
const EditorToolbar = ({ editor, onImageClick }) => {
  if (!editor) return null;
  return (
    <div className="editor-toolbar">
      <select
        onChange={(e) => {
          const level = Number(e.target.value);
          if (level === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level }).run();
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
  const navigate = useNavigate();
  const location = useLocation();
  const { tabId: contextTabId, categoryId: contextCategoryId } =
    location.state || {};

  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [displayName, setDisplayName] = useState({ tab: "", category: "" });

  const [formData, setFormData] = useState({
    tabId: "",
    categoryId: "",
    title: "",
    content: "",
    userName: "",
    userEmail: "",
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    const initData = async () => {
      const member = getCookie("member");
      if (!member) {
        alert("로그인 후 이용 가능합니다.");
        navigate("/auth/login");
        return;
      }

      try {
        const [tabRes, catRes, userRes] = await Promise.all([
          axios.get(`${API_SERVER_URL}/community/tabList`),
          axios.get(`${API_SERVER_URL}/community/category`),
          jwtAxios.get(`${API_SERVER_URL}/api/member/detail`),
        ]);

        const tabsData = tabRes.data.result;
        const catsData = catRes.data.result;
        setTabs(tabsData);
        setCategories(catsData);

        if (userRes.data?.result) {
          setFormData((prev) => ({
            ...prev,
            userName: userRes.data.result.userName,
            userEmail: userRes.data.result.userEmail,
          }));
        }

        if (contextTabId) {
          const tId = String(contextTabId);
          const cId = contextCategoryId ? String(contextCategoryId) : "";

          const foundTab = tabsData.find((t) => String(t.id) === tId);
          const foundCat = catsData.find((c) => String(c.id) === cId);

          setSelectedTabId(tId);
          setFormData((prev) => ({ ...prev, tabId: tId, categoryId: cId }));
          setDisplayName({
            tab: foundTab?.tabName || "",
            category: foundCat?.categoryName || "",
          });
        }
      } catch (err) {
        console.error("초기화 실패", err);
      }
    };
    initData();
  }, [contextTabId, contextCategoryId, navigate]);

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
        );
        editor
          .chain()
          .focus()
          .setImage({ src: `${API_SERVER_URL}${res.data.url}` })
          .run();
      } catch (err) {
        alert("이미지 업로드 실패");
      }
    };
  }, [editor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tabId") {
      const targetTab = tabs.find((t) => String(t.id) === String(value));
      const isAdmin = getCookie("member")?.role === "ADMIN";

      if (targetTab?.adminOnly && !isAdmin) {
        alert("공지사항은 관리자만 작성할 수 있습니다.");
        return;
      }
      setSelectedTabId(value);
      setFormData((prev) => ({ ...prev, [name]: value, categoryId: "" }));
      setDisplayName({ tab: targetTab?.tabName || "", category: "" });
    } else if (name === "categoryId") {
      const targetCat = categories.find((c) => String(c.id) === String(value));
      setFormData((prev) => ({ ...prev, [name]: value }));
      setDisplayName((prev) => ({
        ...prev,
        category: targetCat?.categoryName || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tabId) {
      alert("탭을 추가해주세요");
      return;
    } else if (!formData.categoryId) {
      alert("카테고리를 추가해주세요");
      return;
    } else if (!formData.title) {
      alert("제목을 입력해주세요");
      return;
    } else if (!formData.content) {
      alert("내용을 작성해주세요");
    }
    try {
      await jwtAxios.post(`${API_SERVER_URL}/community/insert`, formData);
      alert("작성 완료!");
      navigate("/community/communityList");
    } catch (err) {
      alert("작성 실패");
    }
  };

  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) => String(cat.tabId) === String(selectedTabId)),
    [selectedTabId, categories],
  );

  return (
    <div className="community-insert-container">
      <h2>
        게시글 작성
        {displayName.tab && ` > ${displayName.tab}`}
        {displayName.category && ` > ${displayName.category}`}
      </h2>

      <form onSubmit={handleSubmit} className="insert-form">
        {!contextTabId ? (
          <div className="form-group">
            <label>탭 선택</label>
            <select name="tabId" value={formData.tabId} onChange={handleChange}>
              <option value="">탭을 선택하세요</option>
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.tabName} {tab.adminOnly ? "(관리자 전용)" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>{displayName.tab}</p>
        )}

        {!contextCategoryId ? (
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
        ) : (
          <p>{displayName.category}</p>
        )}

        <input
          name="title"
          placeholder="제목"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

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
