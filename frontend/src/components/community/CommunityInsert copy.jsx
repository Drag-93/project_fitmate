import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initState = {
  title: "",
  content: "",
  writerName: "",
  categoryId: "",
};
const CommunityInsert = () => {
  const navigate = useNavigate();
  const [insert, setInsert] = useState(initState);
  const [tabs, setTabs] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");

  // 탭, 카테고리 get
  useEffect(() => {
    axios.get("http://localhost:8090/community/category").then((res) => {
      setCategory(res.data.result);
    });
    axios.get("http://localhost:8090/community/tabList").then((res) => {
      setTabs(res.data.result);
    });
  }, []);

  //선택 탭에 따른 카테고리 필터
  const categoryFilter = useMemo(() => {
    // 1. 데이터가 아직 안 왔으면 빈 배열 반환
    if (!category || category.length === 0) return [];

    // 2. 선택된 탭 ID가 없으면 카테고리 목록을 아예 보여주지 않거나 전부 보여줌
    if (!selectedTabId) return [];

    return category.filter((cat) => {
      const catTabId = cat.tabId;

      return String(catTabId) === String(selectedTabId);
    });
  }, [category, selectedTabId]);

  const onTabChange = (e) => {
    setSelectedTabId(e.target.value);
    setInsert((prev) => ({ ...prev, categoryId: "" }));
  };

  const onCommunityInsert = (e) => {
    const { name, value } = e.target;
    setInsert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //
  const onInsertFn = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8090/community/insert",
        insert,
      );
      console.log("서버응답", res.data);

      if (res.status === 200) {
        alert("게시글 작성 성공");
        setInsert({ ...initState });

        navigate("/community/communityList");
      }
    } catch (error) {
      alert("게시글 작성 중 오류 발생");
    }
  };

  return (
    <>
      <div className="cominsert">
        <div className="cominsert-con">
          <h1>게시글 작성</h1>
          <ul>
            <li>
              <label htmlFor="tabId">탭</label>
              <select name="tabId" value={selectedTabId} onChange={onTabChange}>
                <option value="">탭을 선택하세요</option>
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.tabName}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="categoryId">카테고리</label>
              <select
                name="categoryId"
                value={insert.categoryId}
                onChange={onCommunityInsert}
                disabled={!selectedTabId}
              >
                <option value="">
                  {selectedTabId
                    ? "카테고리를 선택하세요"
                    : "탭을 먼저 선택하세요"}
                </option>
                {categoryFilter.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={insert.title}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                name="content"
                value={insert.content}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="writerName">작성자</label>
              <input
                type="text"
                id="writerName"
                name="writerName"
                value={insert.writerName}
                onChange={onCommunityInsert}
              />
            </li>
          </ul>
          <button onClick={onInsertFn}>글작성</button>
        </div>
      </div>
    </>
  );
};

export default CommunityInsert;
