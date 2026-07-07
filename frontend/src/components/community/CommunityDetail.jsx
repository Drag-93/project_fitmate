import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigatge = useNavigate();

  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //상세정보 보기
  const getCommunityDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8090/community/detail/${id}`,
      );
      console.log("상세 데이터 응답 : ", res.data);
      if (res.data?.community) {
        setCommunity(res.data.community);
      }
    } catch (error) {
      console.error("상세정보 로드 실패 : ", error);
      alert("존재하지 않는 게시글입니다");
      navigatge("/community/communityList");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCommunityDetail();
  }, [id]);

  //게시글 수정
  const getCommunityUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `http://localhost:8090/community/update/${id}`,
        community,
      );
      alert("수정되었습니다.");
      navigatge("/community/communityList");
      // 2. 수정 후 상세 페이지를 다시 불러오거나 목록으로 이동
    } catch (error) {
      console.error("수정 실패 : ", error);
      alert("수정 실패");
    } finally {
      setIsLoading(false);
    }
  };

  //게시글 삭제
  const getCommunityDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `http://localhost:8090/community/delete/${id}`,
      );
      console.log("상세 데이터 응답 : ", res.data);
      if (res.data?.result) {
        setCommunity(res.data.result);
      }
    } catch (error) {
      console.error("삭제 실패 : ", error);
      alert("삭제 시도 중 오류가 발생했습니다");
      navigatge("/community/communityList");
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
                      ? `수정일: ${community.updateTime.split("T")[0]}`
                      : `작성일: ${community.createTime.split("T")[0] || ""}`}
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
                  <button onClick={() => getCommunityUpdate()}>수정</button>
                </li>
              </ul>
              <div className="button">
                <button onClick={() => navigatge("/community/communityList")}>
                  목록으로 돌아가기
                </button>
                <button onClick={() => getCommunityDelete()}>삭제</button>
              </div>
            </div>
          ) : (
            <p>게시글 정보가 없습니다</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityDetail;
