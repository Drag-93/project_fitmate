import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TabInsert = () => {
  const navigate = useNavigate();
  // categoryList를 배열로 초기화
  const [tabList, setTabList] = useState([
    { tabName: "", categoryList: [{ categoryName: "" }] },
  ]);

  const onChangeInput = (tabIndex, e) => {
    const { name, value } = e.target;
    const newList = [...tabList];
    newList[tabIndex][name] = value;
    setTabList(newList);
  };

  // 특정 탭의 카테고리 배열 변경
  const onChangeCategory = (tabIndex, catIndex, newValue) => {
    const newList = [...tabList];
    newList[tabIndex].categoryList[catIndex].categoryName = newValue;
    setTabList(newList);
  };

  const onAddInput = () =>
    setTabList([
      ...tabList,
      { tabName: "", categoryList: [{ categoryName: "" }] },
    ]);

  // 카테고리 추가 함수
  const onAddCategory = (tabIndex) => {
    const newList = [...tabList];
    newList[tabIndex].categoryList.push({ categoryName: "" }); // 객체로 저장
    setTabList(newList);
  };

  const onTabFn = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8090/community/tabInsert",
        tabList,
      );
      if (res.status === 200) {
        alert("탭 생성 성공");
        navigate("/community");
      }
    } catch (error) {
      alert("탭 생성 중 오류 발생");
    }
  };

  return (
    <div className="tabInsert">
      <h1>탭 생성 페이지</h1>
      {tabList.map((tab, tabIndex) => (
        <div key={tabIndex}>
          <input
            name="tabName"
            value={tab.tabName}
            onChange={(e) => onChangeInput(tabIndex, e)}
            placeholder="탭 이름"
          />

          {/* 카테고리 목록 출력 */}
          {tab.categoryList.map((cat, catIndex) => (
            <input
              key={catIndex}
              value={cat.categoryName || ""}
              onChange={(e) =>
                onChangeCategory(tabIndex, catIndex, e.target.value)
              }
              placeholder={`카테고리 ${catIndex + 1}`}
            />
          ))}

          <button onClick={() => onAddCategory(tabIndex)}>
            + 카테고리 추가
          </button>

          {tabList.length > 1 && (
            <button
              onClick={() =>
                setTabList(tabList.filter((_, i) => i !== tabIndex))
              }
            >
              탭 삭제
            </button>
          )}
          {tabIndex === tabList.length - 1 && (
            <button onClick={onAddInput}>+ 탭 추가</button>
          )}
        </div>
      ))}
      <button onClick={onTabFn}>전체 만들기</button>
    </div>
  );
};

export default TabInsert;
