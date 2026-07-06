import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../css/Community/CommunityLeft.css";

const CommunityLeft = () => {
  const [tab, setTab] = useState([]);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { categoryId, tabId } = useParams();

  useEffect(() => {
    const setTabListFn = async (e) => {
      try {
        const res = await axios.get(`http://localhost:8090/community/tabList`);
        setTab(res.data.result);
      } catch (err) {
        alert(err);
      }
    };
    setTabListFn();
  }, []);

  useEffect(() => {
    const setCategoryListFn = async (e) => {
      try {
        const res = await axios.get(`http://localhost:8090/community/category`);
        setList(res.data.result);
      } catch (err) {
        alert(err);
      }
    };
    setCategoryListFn();
  }, []);

  useEffect(() => {
    if (tabId || categoryId) {
      axios
        .get("http://localhost:8090/community/communityList", {
          params: {
            tabId: tabId,
            categoryId: categoryId,
          },
        })
        .then((res) => {
          setList(res.data.result);
        })
        .catch((err) => console.error(err));
    }
  }, [tabId, categoryId]);

  return (
    <>
      <div className="community-left">
        <ul>
          <li>
            {/* 전체 탭 이동 */}
            <NavLink to={`/community/communityList`}>전체</NavLink>
          </li>
          {/* 탭 별 페이지 이동 */}
          {tab.map((tab) => (
            <li key={tab.id}>
              <NavLink to={`/community/communityList/tabList/${tab.id}`}>
                {tab.tabName}
              </NavLink>

              {/* 카테고리별 조회 */}
              {tab.categoryDtos && tab.categoryDtos.length > 0 && (
                <ul>
                  {tab.categoryDtos.map((cat) => (
                    <li key={cat.id}>
                      <NavLink
                        to={`/community/communityList/category/${cat.id}`}
                      >
                        {cat.categoryName}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CommunityLeft;
