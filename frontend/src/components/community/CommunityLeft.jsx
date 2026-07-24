import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/Community/CommunityLeft.css";
import { API_SERVER_URL } from "../../apis/commonApi";

const CommunityLeft = () => {
  const [tabList, setTabList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  // 어떤 탭이 열려있는지 관리하는 상태 (null이면 모두 닫힘, id값이 들어가면 해당 탭 열림)
  const [openTabId, setOpenTabId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tabRes = await axios.get(`${API_SERVER_URL}/community/tabList`);
        const catRes = await axios.get(`${API_SERVER_URL}/community/category`);
        setTabList(tabRes.data.result);
        setCategoryList(catRes.data.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // 탭 클릭 시 열림/닫힘 토글 함수
  const handleToggleTab = (tabId, e) => {
    // 링크 자체의 기본 이동을 막고 토글만 제어하고 싶다면 e.preventDefault() 활용 가능
    // 만약 라우터 이동과 토글을 동시에 하고 싶다면 아래와 같이 작성
    setOpenTabId(openTabId === tabId ? null : tabId);
  };

  return (
    <div className="community-left">
      <ul>
        <li>
          <NavLink to="/community/communityList" end>
            전체게시판
          </NavLink>
        </li>
        {tabList.map((tabItem) => (
          <li key={tabItem.id}>
            <div
              className="tab-header"
              onClick={(e) => handleToggleTab(tabItem.id, e)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <NavLink to={`/community/tab/${tabItem.id}`}>
                {tabItem.tabName}
              </NavLink>
              {/* 토글 화살표 표시 (선택사항) */}
              <span>{openTabId === tabItem.id ? "▲" : "▼"}</span>
            </div>

            {/* openTabId가 일치할 때만 open 클래스가 붙어 열린 상태 유지 */}
            <ul className={`overTab ${openTabId === tabItem.id ? "open" : ""}`}>
              {categoryList
                .filter((cat) => cat.tabId === tabItem.id)
                .map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={`/community/tab/${tabItem.id}/category/${cat.id}`}
                    >
                      {cat.categoryName}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityLeft;
