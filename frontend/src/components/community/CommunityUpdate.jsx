import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../apis/util/jwtUtil";

const CommunityUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState([]);
  const [selectedTab, setSelectedTab] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState();

  const [community, setCommunity] = useState({
    title: "",
    content: "",
    attachFile: "",
    userName: "",
    tabName: "",
    categoryName: "",
  });
  const [isLoading, setIsLoading] = useState(true);

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
        setCategory(catRes.data.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const selectCat = (e) => {
    const { name, value } = e.target;
    setCommunity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectTab = (e) => {
    const { name, value } = e.target;
    setCommunity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //수정 시 게시글 데이터 끌어오기
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await jwtAxios.get(
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
      const res = await jwtAxios.put(
        `http://localhost:8090/community/update/${id}`,
        community,
      );
      alert("수정되었습니다.");
      navigate(`/community/detail/${id}`);
      setCommunity(res.data.community);
      // 수정 후 상세 페이지를 다시 불러오거나 목록으로 이동
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
                <label htmlFor="tabId">카테고리</label>
                <select
                  name="tabId"
                  value={community.tabId || ""}
                  onChange={selectTab}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {tab.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.tabName}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label htmlFor="categoryId">카테고리</label>
                <select
                  name="categoryId"
                  value={community.categoryId || ""}
                  onChange={selectCat}
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
