import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../apis/commonApi";

const TabList = () => {
  const navigate = useNavigate();
  const [tabList, setTabList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categoryId, tabId } = useParams();

  const fetchTabData = async () => {
    setIsLoading(true);
    const url = `${API_SERVER_URL}/community/tabList`;
    try {
      const res = await axios.get(url, {
        params: {
          tabId: tabId,
          categoryId: categoryId,
        },
      });
      setTabList(res.data.result || []);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [categoryId, tabId]);
  return (
    <>
      <div className="tabList">
        <div className="tabList-con">
          <h1>탭 목록</h1>
          <button onClick={() => navigate("/community/tabInsert")}>
            탭 추가
          </button>
          {isLoading ? (
            <p>로딩중...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>탭 이름</th>
                  <th>카테고리</th>
                </tr>
              </thead>
              <tbody>
                {tabList.map((tab, index) => (
                  <tr key={tab.id || index}>
                    <td>{tab.id}</td>
                    <td
                      onClick={() => navigate(`/community/tabDetail/${tab.id}`)}
                    >
                      {tab.tabName}
                    </td>
                    <td>
                      {tab.categoryList
                        .map((cat) => cat.categoryName)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default TabList;
