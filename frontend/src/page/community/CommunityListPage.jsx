import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommunityLeft from "../../components/community/CommunityLeft.jsx";
import CommunityList from "../../components/community/CommunityList.jsx";
import { API_SERVER_URL } from "../../apis/commonApi";
import "../../components/css/Community/CommunityLeft.css";
import "../../components/css/Community/CommunityList.css";

const CommunityListPage = () => {
  const { tabId, categoryId } = useParams();
  const [tabList, setTabList] = useState([]);

  useEffect(() => {
    const fetchTabList = async () => {
      try {
        const res = await axios.get(`${API_SERVER_URL}/community/tabList`);
        setTabList(res.data.result || []);
      } catch (err) {
        console.error("탭 목록 로드 실패", err);
      }
    };
    fetchTabList();
  }, []);

  // URL의 tabId(string)로 실제 탭 정보를 찾는다
  const currentTab = tabId
    ? tabList.find((t) => String(t.id) === String(tabId))
    : null;

  const selectTab = {
    tabName: currentTab?.tabName || "전체게시판",
    adminOnly: !!currentTab?.adminOnly,
  };

  const params = {
    tabId: tabId ? Number(tabId) : null,
    categoryId: categoryId ? Number(categoryId) : null,
  };

  return (
    <div className="community-wrapper" style={{ display: "flex" }}>
      <CommunityLeft />
      <CommunityList params={params} tab={selectTab} />
    </div>
  );
};

export default CommunityListPage;
