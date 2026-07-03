import React from "react";
import CommunityList from "../../components/community/CommunityList";
import CommunityLeft from "../../components/community/CommunityLeft";
import "../../components/css/Community/CommunityList.css";
import "../../components/css/Community/CommunityListPage.css";

const CommunityListPage = () => {
  return (
    <>
      <div className="community-page-wrapper">
        <CommunityLeft />
        <CommunityList />
      </div>
    </>
  );
};

export default CommunityListPage;
