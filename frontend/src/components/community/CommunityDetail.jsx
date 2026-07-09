import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reply from "./Reply";
import "../css/Community/CommunityDetail.css";
import jwtAxios from "../../apis/util/jwtUtil";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //상세정보 보기
  const getCommunityDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8090/community/detail/${id}?count=true`,
      );
      if (res.data?.community) {
        setCommunity(res.data.community);
      }
    } catch (error) {
      alert("존재하지 않는 게시글입니다");
      navigate("/community/communityList");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCommunityDetail();
  }, [id]);

  //게시글 삭제
  const getCommunityDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      setIsLoading(true);
      const res = await jwtAxios.delete(
        `http://localhost:8090/community/delete/${id}`,
      );
      if (res.data?.result) {
        setCommunity(res.data.result);
        navigate("/community/index");
      }
    } catch (error) {
      alert("삭제 시도 중 오류가 발생했습니다");
      navigate("/community/index");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="communityDetail">
        <div className="communityDetail-con">
          <h1>게시글 상세 페이지</h1>
          {isLoading ? (
            <p>데이터를 불러오는 중입니다</p>
          ) : community ? (
            <div className="detailbody">
              <ul>
                {/* <li>{community.writerName}</li> */}
                <li>
                  <label htmlFor="title">제목</label>
                  <input
                    type="text"
                    name="title"
                    value={community.title || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setCommunity({ ...community, title: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="memberEmail">작성자</label>
                  <input
                    type="text"
                    name="memberEmail"
                    value={community.memberEmail || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setCommunity({
                        ...community,
                        memberEmail: e.target.value,
                      })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="title">조회수</label>
                  <input
                    type="text"
                    name="hit"
                    value={community.hit || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setCommunity({ ...community, hit: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="title">탭 이름</label>
                  <input
                    type="text"
                    name="tab"
                    value={community.tabName || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setCommunity({ ...community, tabName: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="title">카테고리 이름</label>
                  <input
                    type="text"
                    name="categoryName"
                    value={community.categoryName || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setCommunity({
                        ...community,
                        categoryName: e.target.value,
                      })
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
                  <label>날짜</label>
                  <div className="view-box">
                    {community.updateTime
                      ? `수정일: ${community.updateTime?.split("T")[0] || ""}`
                      : community.createTime
                        ? `작성일: ${community.createTime?.split("T")[0] || ""}`
                        : "날짜 정보 없음"}
                  </div>
                </li>
                <li>
                  <label htmlFor="file">첨부파일</label>
                  <div className="file">
                    {community.attachFile
                      ? community.attachFile
                      : "첨부파일 없음"}
                  </div>
                </li>
                <li>
                  <li>
                    <button
                      onClick={() =>
                        navigate(`/community/update/${community.id}`)
                      }
                    >
                      수정
                    </button>
                  </li>
                </li>
              </ul>
              <div className="button">
                <button onClick={() => navigate("/community/communityList")}>
                  목록으로 돌아가기
                </button>
                <button onClick={() => getCommunityDelete()}>삭제</button>
              </div>
            </div>
          ) : (
            <p>게시글 정보가 없습니다</p>
          )}
        </div>
        <Reply communityId={id} />
      </div>
    </>
  );
};

export default CommunityDetail;
