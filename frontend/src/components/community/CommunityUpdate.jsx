import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommunityUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState();

  const [community, setCommunity] = useState({
    title: "",
    content: "",
    attachFile: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8090/community/category").then((res) => {
      setCategory(res.data.result);
    });
  }, []);

  const select = (e) => {
    const { name, value } = e.target;
    selectCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //수정 시 게시글 데이터 끌어오기
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8090/community/detail/${id}`,
        );
        if (res.data?.community) {
          setCommunity(res.data.community);
        }
      } catch (error) {
        alert(error);
        navigate("/community");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  //게시글 수정
  const getCommunityUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `http://localhost:8090/community/update/${id}`,
        community,
      );
      alert("수정되었습니다.");
      navigate(`/community/detail/${id}`);
      // 2. 수정 후 상세 페이지를 다시 불러오거나 목록으로 이동
    } catch (error) {
      alert("수정 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="communityUpdate">
        <div className="communityUpdate-con">
          <h1>게시글 상세 페이지</h1>
          <div className="detailbody">
            <ul>
              <li>
                <label htmlFor="categoryId">카테고리</label>
                <select
                  name="categoryId"
                  value={category.categoryId}
                  onChange={select}
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
                  name="title"
                  value={community.title} // 데이터가 들어오기 전 에러 방지
                  onChange={(e) =>
                    setCommunity({ ...community, title: e.target.value })
                  }
                />
              </li>
              <li>
                <label htmlFor="content">내용</label>
                <textarea
                  name="content"
                  value={community.content || ""}
                  onChange={(e) =>
                    setCommunity({ ...community, content: e.target.value })
                  }
                />
              </li>
              <li>
                <label htmlFor="file">첨부파일</label>
                <div className="file">
                  {community.attachFile
                    ? community.attachFile
                    : "첨부파일 없음"}
                </div>
              </li>
            </ul>
            <div className="button">
              <button onClick={() => getCommunityUpdate()}>수정</button>
              <button onClick={() => navigate(-1)}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityUpdate;
