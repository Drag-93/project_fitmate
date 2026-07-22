import React from "react";
import CommunityLeft from "../../components/community/CommunityLeft";
import CommunityMain from "../../components/community/CommunityMain";
import "../../components/css/Community/CommunityMainPage.css";
import "../../components/css/Community/CommunityLeft.css";
import "../../components/css/Community/CommunityMain.css";

const CommunityMainPage = () => {
  return (
    <div className="community-wrapper">
      <CommunityLeft />
      <CommunityMain />
    </div>
  );
};

export default CommunityMainPage;
