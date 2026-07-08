import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../css/Community/CommunityLeft.css";

const CommunityLeft = ({ onSelect }) => {
  const [tab, setTab] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tabRes = await axios.get(
          "http://localhost:8090/community/tabList",
        );
        const catRes = await axios.get(
          "http://localhost:8090/community/category",
        );
        setTab(tabRes.data.result);
        setCategoryList(catRes.data.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="community-left">
        <ul>
          <li>
            {/* 전체 탭 이동 */}
            {/* <NavLink to={`/community/communityList`}>전체</NavLink> */}
            <button onClick={() => onSelect(null, null, "전체게시판")}>
              전체게시판
            </button>
          </li>
          {/* 탭 별 페이지 이동 */}
          {tab.map((tab) => (
            <li key={tab.id}>
              {/* <NavLink to={`/community/list/${tab.id}`}>{tab.tabName}</NavLink> */}
              <button
                onClick={() => onSelect(tab.id, categoryList.id, tab.tabName)}
              >
                {tab.tabName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CommunityLeft;
