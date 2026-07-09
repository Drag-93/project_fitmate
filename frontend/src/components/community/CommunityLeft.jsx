import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../css/Community/CommunityLeft.css";

const CommunityLeft = ({ onSelect }) => {
  const [tab, setTab] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [overTab, setOverTab] = useState([]);
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
    <div className="community-left">
      <ul>
        <li>
          <span onClick={() => onSelect(null, null, "전체게시판")}>
            전체게시판
          </span>
        </li>
        {tab.map((tab) => (
          <li
            key={tab.id}
            onMouseEnter={() => setOverTab(tab.id)}
            onMouseLeave={() => setOverTab(null)}
          >
            <span onClick={() => onSelect(tab.id, null, tab.tabName)}>
              {tab.tabName}
            </span>

            {/* 탭에 마우스가 올라갔을 때만 보여지는 카테고리 리스트 */}
            {overTab === tab.id && (
              <ul className="overTab">
                {categoryList
                  .filter((cat) => cat.tabId === tab.id)
                  .map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => onSelect(tab.id, cat.id, cat.categoryName)}
                    >
                      {cat.categoryName}
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityLeft;
