import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initState = {
  title: "",
  content: "",
  writerName: "",
  categoryId: "",
};
const CommunityInsert = () => {
  const navigate = useNavigate();
  const [insert, setInsert] = useState(initState);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8090/community/category")
      .then((res) => {
        setCategory(res.data.result);
      })
      .catch((err) => console.error("카테고리 로딩 실패", err));
  }, []);

  const onCommunityInsert = (e) => {
    const { name, value } = e.target;
    setInsert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //
  const onInsertFn = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8090/community/insert",
        insert,
      );
      console.log("서버응답", res.data);

      if (res.status === 200) {
        alert("게시글 작성 성공");
        setInsert({ ...initState });

        navigate("/community/communityList");
      }
    } catch (error) {
      console.error("게시글 작성 실패", error);
      alert("게시글 작성 중 오류 발생");
    }
  };

  return (
    <>
      <div className="cominsert">
        <div className="cominsert-con">
          <h1>게시글 작성</h1>
          <ul>
            <li>
              <label htmlFor="categoryId">카테고리</label>
              <select
                name="categoryId"
                value={insert.categoryId}
                onChange={onCommunityInsert}
              >
                <option value="">카테고리를 선택하세요</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={insert.title}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="content">내용</label>
              <input
                type="text"
                id="content"
                name="content"
                value={insert.content}
                onChange={onCommunityInsert}
              />
            </li>
            <li>
              <label htmlFor="writerName">작성자</label>
              <input
                type="text"
                id="writerName"
                name="writerName"
                value={insert.writerName}
                onChange={onCommunityInsert}
              />
            </li>
          </ul>
          <button onClick={onInsertFn}>글작성</button>
        </div>
      </div>
    </>
  );
};

export default CommunityInsert;
