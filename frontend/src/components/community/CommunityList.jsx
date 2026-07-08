import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommunityList = ({ params, tabName }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8090/community/list", { params })
      .then((res) => setList(res.data.result))
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <>
      <div className="communityList">
        <div className="communityList-con">
          <h1>{tabName}</h1>
          <button onClick={() => navigate("/community/insert")}>
            게시글 작성
          </button>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {list.map((list, index) => (
                <tr key={list.id || index}>
                  <td>{list.id}</td>
                  <td>{list.categoryName}</td>
                  <td onClick={() => navigate(`/community/detail/${list.id}`)}>
                    {list.title}
                  </td>
                  <td>{list.hit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CommunityList;
