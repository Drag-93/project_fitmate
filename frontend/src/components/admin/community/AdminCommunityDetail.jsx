import { useEffect, useState } from "react";
import axios from "axios";
import { API_SERVER_URL } from "../../../apis/commonApi";
import jwtAxios from "../../../apis/util/jwtUtil";

const AdminCommunityDetail = ({ id, onClose, onDeleted }) => {
  const [community, setCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_SERVER_URL}/community/detail/${id}?count=true`,
        );
        if (res.data?.community) setCommunity(res.data.community);
      } catch (err) {
        alert("존재하지 않는 게시글입니다");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  //게시글 삭제
  const handleDelete = async () => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await jwtAxios.delete(`${API_SERVER_URL}/community/adminDelete/${id}`);
      alert("삭제되었습니다");
      onDeleted();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  //게시글 이미지 불러오기
  const renderableContent = (community?.content || "").replace(
    /src="\/upload\//g,
    `src="${API_SERVER_URL}/upload/`,
  );

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>게시글 상세보기</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {isLoading ? (
          <p>데이터를 불러오는 중입니다</p>
        ) : community ? (
          <div className="detailbody">
            <div className="form-row">
              <label>제목</label>
              <input type="text" value={community.title || ""} readOnly />
            </div>

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

            <div className="form-group-row">
              <div className="flex-item">
                <label>작성자</label>
                <input type="text" value={community.userName || ""} readOnly />
              </div>
              <div className="flex-item">
                <label>조회수</label>
                <input type="text" value={community.hit || ""} readOnly />
              </div>
            </div>

            <div className="form-row">
              <label>내용</label>
              <div
                className="content-view"
                dangerouslySetInnerHTML={{ __html: renderableContent }}
              />
            </div>

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

            <div className="admin-modal-actions">
              <button type="button" onClick={handleDelete}>
                삭제
              </button>
              <button type="button" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        ) : (
          <p>게시글 정보가 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default AdminCommunityDetail;
