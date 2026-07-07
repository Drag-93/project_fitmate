import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommunityList = ({ params, tabName }) => {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categoryId, tabId } = useParams();

  useEffect(() => {
    const fetchCommunityData = async () => {
      setIsLoading(true);
      try {
        // params가 {tabId: 1, categoryId: null} 이런 형태여야 함
        const res = await axios.get("http://localhost:8090/community/list", {
          params,
        });
        setCommunityList(res.data.result || []);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunityData();
  }, [params]);

  return (
    <>
      <div className="communityList">
        <div className="communityList-con">
          <h1>{tabName}</h1>
          <button onClick={() => navigate("/community/insert")}>
            게시글 작성
          </button>
          {isLoading ? (
            <p>로딩중...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {communityList.map((community, index) => (
                  <tr key={community.id || index}>
                    <td>{community.id}</td>
                    <td
                      onClick={() =>
                        navigate(`/community/detail/${community.id}`)
                      }
                    >
                      {community.title}
                    </td>
                    <td>{community.hit}</td>
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

export default CommunityList;
