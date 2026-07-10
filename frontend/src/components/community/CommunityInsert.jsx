import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/util/jwtUtil";

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
  });

  // 1. 초기 데이터 로드 (탭과 카테고리)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tabRes, catRes] = await Promise.all([
          axios.get("http://localhost:8090/community/tabList"),
          axios.get("http://localhost:8090/community/category"),
        ]);
        setTabs(tabRes.data.result);
        setCategories(catRes.data.result); // [핵심] tabId가 포함된 카테고리 리스트
        await getUser();
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchData();
  }, []);

  const getUser = async () => {
    try {
      const res = await jwtAxios.get("http://localhost:8090/api/member/detail");
      if (res.data?.result) {
        setFormData((prev) => ({
          ...prev,
          userName: res.data.result.userName,
        }));
      }
    } catch (error) {
      console.error("회원 정보를 불러올 수 없습니다.", error);
    }
  };

  // 2. 탭 선택 시 하위 카테고리 필터링
  const filteredCategories = useMemo(() => {
    if (!selectedTabId) return [];
    return categories.filter(
      (cat) => String(cat.tabId) === String(selectedTabId),
    );
  }, [selectedTabId, categories]);

  // 3. 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tabId") {
      setSelectedTabId(value);
      setFormData({ ...formData, [name]: value, categoryId: "" }); // 탭 바뀌면 카테고리 초기화
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 4. 작성 완료 (제출)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8090/community/insert", formData);
      alert("작성 완료!");
      navigate("/community/communityList");
    } catch (err) {
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

        <input
          name="title"
          placeholder="제목을 입력하세요"
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          onChange={handleChange}
        />
        <input name="userName" value={formData.userName} readOnly />

        <button type="submit" className="submit-btn">
          글 작성하기
        </button>
      </form>
    </div>
  );
};

export default CommunityInsert;
