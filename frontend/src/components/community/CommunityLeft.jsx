import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../css/Community/CommunityLeft.css";
import { API_SERVER_URL } from "../../apis/commonApi";

const CommunityLeft = ({ onSelect }) => {
  const [tabList, setTabList] = useState([]); // tab -> tabList로 이름 변경 (map 변수와 헷갈림 방지)
  const [categoryList, setCategoryList] = useState([]);
  const [overTab, setOverTab] = useState(null);
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

  return (
    <div className="community-left">
      <ul>
        <li>
          {/* 전체게시판은 특정 탭이 아니므로 adminOnly는 항상 false */}
          <span onClick={() => onSelect(null, null, "전체게시판", false)}>
            전체게시판
          </span>
        </li>
        {tabList.map((tabItem) => (
          <li
            key={tabItem.id}
            onMouseEnter={() => setOverTab(tabItem.id)}
            onMouseLeave={() => setOverTab(null)}
          >
            {/* ★ tabItem.adminOnly를 4번째 인자로 추가 */}
            <span
              onClick={() =>
                onSelect(tabItem.id, null, tabItem.tabName, tabItem.adminOnly)
              }
            >
              {tabItem.tabName}
            </span>

            {/* 탭에 마우스가 올라갔을 때만 보여지는 카테고리 리스트 */}
            {overTab === tabItem.id && (
              <ul className="overTab">
                {categoryList
                  .filter((cat) => cat.tabId === tabItem.id)
                  .map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() =>
                        // 카테고리는 자체 adminOnly가 없으니, 소속된 tabItem의 adminOnly를 그대로 사용
                        onSelect(
                          tabItem.id,
                          cat.id,
                          cat.categoryName,
                          tabItem.adminOnly,
                        )
                      }
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
