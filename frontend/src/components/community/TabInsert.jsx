import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TabInsert = () => {
  const navigate = useNavigate();
  const [tabList, setTabList] = useState([{ tabName: "", categoryList: "" }]);

  const onChangeInput = (index, e) => {
    const { name, value } = e.target;
    const newList = [...tabList];
    newList[index][name] = value;
    setTabList(newList);
  };

  const onAddInput = () =>
    setTabList([...tabList, { tabName: "", categoryList: "" }]);
  const onRemoveInput = (index) =>
    setTabList(tabList.filter((_, i) => i !== index));

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
    <>
      <div className="tabInsert">
        <h1>탭 생성 페이지</h1>
        <ul>
          {tabList.map((item, index) => (
            <li key={index}>
              <input
                name="tabName"
                value={item.tabName}
                onChange={(e) => onChangeInput(index, e)}
                placeholder="탭 이름"
              />
              <input
                name="categoryList"
                value={item.categoryList}
                onChange={(e) => onChangeInput(index, e)}
                placeholder="카테고리명"
              />

              {tabList.length > 1 && (
                <button onClick={() => onRemoveInput(index)}>-</button>
              )}
              {index === tabList.length - 1 && (
                <button onClick={onAddInput}>+</button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={onTabFn}>만들기</button>
      </div>
    </>
  );
};

export default TabInsert;
