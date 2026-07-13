import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reply from "./Reply";
import "../css/Community/CommunityDetail.css";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

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
        `${API_SERVER_URL}/community/detail/${id}?count=true`,
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
        `${API_SERVER_URL}/community/delete/${id}`,
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

  // content 안의 상대경로 이미지(src="/upload/...")를
  // 백엔드 서버 주소 기준 절대경로로 보정
  const renderableContent = (community?.content || "").replace(
    /src="\/upload\//g,
    `src="${API_SERVER_URL}/upload/`,
  );

  return (
    <>
      <div className="communityDetail">
        <div className="communityDetail-con">
          <h1>게시글 상세 페이지</h1>
          {isLoading ? (
            <p>데이터를 불러오는 중입니다</p>
          ) : community ? (
            <div className="detailbody">
              {/* 제목 (1줄 배치) */}
              <div className="form-row">
                <label>제목</label>
                <input type="text" value={community.title || ""} readOnly />
              </div>

              {/* 탭 + 카테고리 (같은 줄 배치) */}
              <div className="form-group-row">
                <div className="flex-item">
                  <label>탭 이름</label>
                  <input type="text" value={community.tabName || ""} readOnly />
                </div>
                <div className="flex-item">
                  <label>카테고리 이름</label>
                  <input
                    type="text"
                    value={community.categoryName || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* 작성자 + 조회수 (같은 줄 배치) */}
              <div className="form-group-row">
                <div className="flex-item">
                  <label>작성자</label>
                  <input
                    type="text"
                    value={community.userName || ""}
                    readOnly
                  />
                </div>
                <div className="flex-item">
                  <label>조회수</label>
                  <input type="text" value={community.hit || ""} readOnly />
                </div>
              </div>

              {/* 내용 (보더라인 적용) */}
              <div className="form-row">
                <label>내용</label>
                <div
                  className="content-view"
                  dangerouslySetInnerHTML={{ __html: renderableContent }}
                />
              </div>

              {/* 날짜 및 버튼 영역 */}
              <div className="form-row">
                <label>날짜</label>
                <div className="view-box">
                  {community.updateTime
                    ? `수정일: ${community.updateTime?.split("T")[0] || ""}`
                    : community.createTime
                      ? `작성일: ${community.createTime?.split("T")[0] || ""}`
                      : "날짜 정보 없음"}
                </div>
              </div>

              <div className="button-group">
                <button
                  onClick={() => navigate(`/community/update/${community.id}`)}
                >
                  수정
                </button>
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
