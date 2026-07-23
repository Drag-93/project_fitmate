import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";
import TiptapEditor from "./TiptapEditor";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 개당 5MB 제한
const MAX_IMAGE_COUNT = 4; // 최대 4장

const countImages = (html) => (html.match(/<img/g) || []).length;

const CommunityInsert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabId: contextTabId, categoryId: contextCategoryId } =
    location.state || {};

  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [displayName, setDisplayName] = useState({ tab: "", category: "" });
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    tabId: "",
    categoryId: "",
    title: "",
    content: "",
    userName: "",
    userEmail: "",
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
      const isAdmin = getCookie("member")?.role === "ADMIN";

      // FAQ는 관리자만 작성 가능
      if (targetCat?.categoryName === "FAQ" && !isAdmin) {
        alert("FAQ는 관리자만 작성할 수 있습니다.");
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      setDisplayName((prev) => ({
        ...prev,
        category: targetCat?.categoryName || "",
      }));
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
      return;
    }

    if (uploading) {
      alert("이미지 업로드가 끝난 후 제출해주세요.");
      return;
    }

    // 최종 방어: 제출 직전 다시 한번 이미지 개수 확인
    if (countImages(formData.content) > MAX_IMAGE_COUNT) {
      alert(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 첨부할 수 있습니다.`);
      return;
    }

    try {
      await jwtAxios.post(`${API_SERVER_URL}/community/insert`, formData);
      alert("작성 완료!");
      navigate(
        `/community/tab/${formData.tabId}/category/${formData.categoryId}`,
      );
    } catch (err) {
      if (err?.response?.status === 413) {
        alert("첨부한 이미지 용량이 너무 커서 저장할 수 없습니다.");
      } else if (err?.response?.status === 400) {
        alert(err?.response?.data?.message || "요청 형식이 올바르지 않습니다.");
      } else {
        alert("작성 실패");
      }
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

        <TiptapEditor
          value={formData.content}
          onChange={(html) =>
            setFormData((prev) => ({ ...prev, content: html }))
          }
          onUploadingChange={setUploading}
          maxImageCount={MAX_IMAGE_COUNT}
          maxImageSize={MAX_IMAGE_SIZE}
        />

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "이미지 업로드 중..." : "글 작성하기"}
        </button>
      </form>
    </div>
  );
};

export default CommunityInsert;
