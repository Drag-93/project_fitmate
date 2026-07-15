import React, { useState } from "react";
import "../../components/css/Community/communityList.css";
import "../../components/css/Community/communityLeft.css";
import CommunityLeft from "./../../components/community/CommunityLeft";
import CommunityList from "../../components/community/CommunityList";

const CommunityListPage = () => {
  const [params, setParams] = useState({ tabId: null, categoryId: null });
  const [selectTab, setSelectTab] = useState({
    tabName: "전체게시판",
    adminOnly: false,
  });
  const handleSelect = (tabId, categoryId, tabName, adminOnly) => {
    setParams({ tabId, categoryId });
    setSelectTab({
      tabName: tabName || "전체게시판",
      adminOnly: !!adminOnly,
    });
  };
  return (
    <div className="community-wrapper" style={{ display: "flex" }}>
      {/* 클릭 이벤트를 부모가 정의한 handSelect로 연결 */}
      <CommunityLeft onSelect={handleSelect} />

      {/* 관리중인 파라미터를 리스트 컴포넌트로 전달 */}
      <CommunityList params={params} tab={selectTab} />
    </div>
  );
};

export default CommunityListPage;
