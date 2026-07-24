import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";
import TiptapEditor from "./TiptapEditor";

const CommunityUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [community, setCommunity] = useState({
    title: "",
    content: "",
    tabId: "",
    categoryId: "",
    attachFile: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // 게시글 데이터 + 탭/카테고리 목록 페치
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tabRes, catRes, detailRes] = await Promise.all([
          axios.get(`${API_SERVER_URL}/community/tabList`),
          axios.get(`${API_SERVER_URL}/community/category`),
          jwtAxios.get(`${API_SERVER_URL}/community/detail/${id}`),
        ]);
        setTabs(tabRes.data.result);
        setCategories(catRes.data.result);
        setCommunity({
          ...detailRes.data.community,
          tabId: String(detailRes.data.community.tabId),
          categoryId: String(detailRes.data.community.categoryId),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) => String(cat.tabId) === String(community.tabId)),
    [categories, community.tabId],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tabId") {
      const targetTab = tabs.find((t) => String(t.id) === String(value));
      const isAdmin = getCookie("member")?.role === "ADMIN";

      if (targetTab?.adminOnly && !isAdmin) {
        alert("공지사항은 관리자만 작성할 수 있습니다.");
        return;
      }
      // 탭이 바뀌면 카테고리는 초기화 (이전 탭의 카테고리가 남아있지 않도록)
      setCommunity((prev) => ({ ...prev, tabId: value, categoryId: "" }));
    } else if (name === "categoryId") {
      const targetCat = categories.find((c) => String(c.id) === String(value));
      const isAdmin = getCookie("member")?.role === "ADMIN";

      if (targetCat?.categoryName === "FAQ" && !isAdmin) {
        alert("FAQ는 관리자만 작성할 수 있습니다.");
        return;
      }
      setCommunity((prev) => ({ ...prev, categoryId: value }));
    } else {
      setCommunity((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 수정 요청
  const getCommunityUpdate = async (e) => {
    e.preventDefault();
    if (!community.tabId) {
      alert("탭을 선택해주세요");
      return;
    }
    if (!community.categoryId) {
      alert("카테고리를 선택해주세요");
      return;
    }
    if (!community.title) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!community.content) {
      alert("내용을 작성해주세요");
      return;
    }

    try {
      await jwtAxios.put(`${API_SERVER_URL}/community/update/${id}`, community);
      alert("수정되었습니다.");
      navigate(`/community/detail/${id}`);
    } catch (error) {
      alert("수정 실패");
    }
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="communityUpdate">
      <h1>게시글 수정</h1>
      <form onSubmit={getCommunityUpdate} className="insert-form">
        <div className="form-group">
          <label>작성자</label>
          <input name="userName" value={community.userName} readOnly />
        </div>

        <div className="form-group">
          <label>탭 선택</label>
          <select name="tabId" value={community.tabId} onChange={handleChange}>
            <option value="">탭을 선택하세요</option>
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.tabName} {tab.adminOnly ? "(관리자 전용)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>카테고리 선택</label>
          <select
            name="categoryId"
            value={community.categoryId}
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
          <label>제목</label>
          <input
            name="title"
            placeholder="제목을 입력하세요"
            value={community.title}
            onChange={handleChange}
          />
        </div>

        <TiptapEditor
          value={community.content}
          onChange={(html) =>
            setCommunity((prev) => ({ ...prev, content: html }))
          }
        />

        <button type="submit" className="submit-btn">
          수정
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>
      </form>
    </div>
  );
};

export default CommunityUpdate;
