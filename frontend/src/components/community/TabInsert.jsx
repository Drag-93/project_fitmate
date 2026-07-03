import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TabInsert = () => {
  const navigate = useNavigate();
  const [tabList, setTabList] = useState([{ tabName: "", categoryList: [""] }]);

  const onChangeInput = (index, e) => {
    const { name, value } = e.target;
    const newList = [...tabList];
    newList[index][name] = value;
    setTabList(newList);
  };

  const onAddInput = () =>
    setTabList([...tabList, { tabName: "", categoryList: [""] }]);
  const onRemoveInput = (index) =>
    setTabList(tabList.filter((_, i) => i !== index));

  const onChangeCategory = (tabIndex, catIndex, value) => {
    const newList = [...tabList];
    newList[tabIndex].categoryList[catIndex] = value;
    setTabList(newList);
  };

  const onTabFn = async () => {
    try {
      const res = await axios.post("http://localhost:8090/tab/insert", tabList);
      console.log("서버응답", res.data);

      if (res.status === 200) {
        alert("탭 생성 성공");

        navigate("/tab");
      }
    } catch (error) {
      console.error("탭생성 에러", error);
      alert("탭 생성 중 오류 발생");
    }
  };

  return (
    <div className="tabInsert">
      <h1>탭 생성 페이지</h1>
      {tabList.map((tab, tabIndex) => (
        <div
          key={tabIndex}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
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
              value={cat}
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
