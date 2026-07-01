import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CommunityList = () => {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCommunityList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8090/community");
      if (res.data?.result) {
        setCommunityList(res.data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCommunityList();
  }, []);

  return (
    <>
      <div className="communityList">
        <div className="communityList-con">
          <h1>게시글 목록</h1>
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
                  <tr ket={community.id || index}>
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
