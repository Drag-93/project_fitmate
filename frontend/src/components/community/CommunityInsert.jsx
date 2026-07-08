import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const CommunityInsert = () => {
  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [formData, setFormData] = useState({
    tabId: "",
    categoryId: "",
    title: "",
    content: "",
    writerName: "",
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
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchData();
  }, []);

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
    } catch (err) {
      alert("작성 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 탭 선택 */}
      <select name="tabId" value={formData.tabId} onChange={handleChange}>
        <option value="">탭을 선택하세요</option>
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.tabName}
          </option>
        ))}
      </select>

      {/* 카테고리 선택 (필터링된 목록만 보여줌) */}
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

      <input name="title" placeholder="제목" onChange={handleChange} />
      <textarea name="content" placeholder="내용" onChange={handleChange} />
      <input name="writerName" placeholder="작성자" onChange={handleChange} />
      <button type="submit">글작성</button>
    </form>
  );
};

export default CommunityInsert;
