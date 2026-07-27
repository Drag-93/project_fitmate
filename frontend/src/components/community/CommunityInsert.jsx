import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";
import TiptapEditor from "./TiptapEditor";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 개당 5MB 제한
const MAX_IMAGE_COUNT = 4; // 최대 4장

// 에디터 HTML에서 img 태그 개수 세기 (제출 직전 최종 검증용)
const countImages = (html) => (html.match(/<img/g) || []).length;

/**
 * 일반 사용자용 게시글 작성 페이지
 * - CommunityLeft/CommunityList 등에서 특정 탭/카테고리를 지정해 이동해온 경우
 *   location.state로 tabId/categoryId를 미리 받아 해당 값으로 고정
 * - 직접 진입한 경우에는 탭/카테고리를 select로 선택 가능
 */
const CommunityInsert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 이전 화면(목록 등)에서 넘겨준 탭/카테고리 컨텍스트 (있으면 select 대신 고정 표시)
  const { tabId: contextTabId, categoryId: contextCategoryId } =
    location.state || {};

  const [tabs, setTabs] = useState([]); // 전체 탭 목록
  const [categories, setCategories] = useState([]); // 전체 카테고리 목록
  const [selectedTabId, setSelectedTabId] = useState(""); // 현재 선택된 탭 id (카테고리 필터링용)
  const [displayName, setDisplayName] = useState({ tab: "", category: "" }); // 헤더에 표시할 탭/카테고리 이름
  const [uploading, setUploading] = useState(false); // 에디터 이미지 업로드 진행 여부 (제출 버튼 비활성화용)

  const [formData, setFormData] = useState({
    tabId: "",
    categoryId: "",
    title: "",
    content: "",
    userName: "",
    userEmail: "",
  });

  // 마운트 시: 로그인 체크 → 탭/카테고리/작성자 정보 병렬 조회 → 컨텍스트로 넘어온 탭/카테고리 있으면 자동 세팅
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

        // 로그인한 사용자 정보를 작성자명/이메일로 자동 세팅
        if (userRes.data?.result) {
          setFormData((prev) => ({
            ...prev,
            userName: userRes.data.result.userName,
            userEmail: userRes.data.result.userEmail,
          }));
        }

        // 목록 화면 등에서 특정 탭/카테고리를 지정해 들어온 경우, 해당 값을 폼에 미리 채워둠
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

  // 탭/카테고리 select 변경 핸들러 (권한 검증 포함)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tabId") {
      const targetTab = tabs.find((t) => String(t.id) === String(value));
      const isAdmin = getCookie("member")?.role === "ADMIN";

      // 관리자 전용 탭(공지사항)은 일반 사용자가 선택할 수 없도록 차단
      if (targetTab?.adminOnly && !isAdmin) {
        alert("공지사항은 관리자만 작성할 수 있습니다.");
        return;
      }
      setSelectedTabId(value);
      // 탭이 바뀌면 이전에 선택했던 카테고리는 초기화
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

  // 폼 제출: 필수값 검증 → 업로드 진행 중 여부 확인 → 이미지 개수 최종 검증 → 등록 요청
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

    // 에디터에서 이미지 업로드가 아직 진행 중이면 제출을 막음
    if (uploading) {
      alert("이미지 업로드가 끝난 후 제출해주세요.");
      return;
    }

    // 최종 방어: 제출 직전 다시 한번 이미지 개수 확인 (에디터 내부 검증을 우회했을 가능성 대비)
    if (countImages(formData.content) > MAX_IMAGE_COUNT) {
      alert(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지만 첨부할 수 있습니다.`);
      return;
    }

    try {
      await jwtAxios.post(`${API_SERVER_URL}/community/insert`, formData);
      alert("작성 완료!");
      // 작성 완료 후 방금 작성한 탭/카테고리의 목록 페이지로 이동
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

  // 현재 선택된 탭(selectedTabId)에 속한 카테고리만 필터링해 select 옵션으로 사용
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
        {/* 컨텍스트로 탭이 지정되지 않은 경우에만 탭 선택 select 표시, 지정된 경우 텍스트로 고정 표시 */}
        {/* 전체 게시판 탭 있으면 주석해제 */}
        {/* {!contextTabId ? (
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
        )} */}

        {/* 컨텍스트로 카테고리가 지정되지 않은 경우에만 카테고리 선택 select 표시 */}
        {/* 전체게시판 탭 있으면 주석해제 */}
        {/* {!contextCategoryId ? (
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
        )} */}

        {/* 제목 입력 */}
        <input
          name="title"
          placeholder="제목"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* 본문 작성용 리치 텍스트 에디터, 이미지 업로드 상태를 uploading으로 추적 */}
        <TiptapEditor
          value={formData.content}
          onChange={(html) =>
            setFormData((prev) => ({ ...prev, content: html }))
          }
          onUploadingChange={setUploading}
          maxImageCount={MAX_IMAGE_COUNT}
          maxImageSize={MAX_IMAGE_SIZE}
        />

        {/* 업로드 진행 중에는 제출 버튼 비활성화 + 안내 문구로 변경 */}
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "이미지 업로드 중..." : "글 작성하기"}
        </button>
      </form>
    </div>
  );
};

export default CommunityInsert;
