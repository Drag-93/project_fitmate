import React, { useState } from "react";
import CommunityLeft from "./CommunityLeft";
import CommunityList from "./CommunityList";

const CommunityIndex = () => {
  const [params, setParams] = useState({ tabId: null, categoryId: null });
  const [selectTabName, setSelectTabName] = useState("전체게시판");
  const handleSelect = (tabId, categoryId, tabName) => {
    setParams({ tabId, categoryId });
    setSelectTabName(tabName || "전체게시판");
  };
  return (
    <div className="community-wrapper" style={{ display: "flex" }}>
      {/* 클릭 이벤트를 부모가 정의한 handSelect로 연결 */}
      <CommunityLeft onSelect={handleSelect} />

      {/* 관리중인 파라미터를 리스트 컴포넌트로 전달 */}
      <CommunityList params={params} tabName={selectTabName} />
    </div>
  );
};

export default CommunityIndex;
