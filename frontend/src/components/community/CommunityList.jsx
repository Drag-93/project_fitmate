import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";

const CommunityList = ({ params, tab }) => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); // 0부터 시작 (Spring Pageable 기본)
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // 상태 추가
  const size = 10;
  const navigate = useNavigate();
  const member = getCookie("member");
  const isAdmin = member?.role && String(member.role).toUpperCase() === "ADMIN";
  const canShowWriteButton = useMemo(() => {
    if (!tab) return true;
    if (tab.adminOnly) {
      return isAdmin;
    }
    return true;
  }, [tab, isAdmin]);

  useEffect(() => {
    // 탭/카테고리가 바뀌면 1페이지로 리셋
    setPage(0);
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_SERVER_URL}/community/tclist`, {
          params: {
            tabId: params?.tabId,
            categoryId: params?.categoryId,
            page,
            size: 10,
          },
        });
        const { content, totalPages: tp, totalElements: te } = res.data.result;
        setList(content || []);
        setTotalPages(tp || 0);
        setTotalElements(te || 0);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [params, page]);

  const handleWriteClick = () => {
    const member = getCookie("member");
    if (!member?.access) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
      return;
    }
    if (tab?.adminOnly && member.role !== "ADMIN") {
      alert("공지사항은 관리자만 작성할 수 있습니다.");
      return;
    }
    navigate("/community/insert", {
      state: { tabId: params?.tabId, categoryId: params?.categoryId },
    });
  };

  return (
    <>
      <div className="communityList">
        <div className="communityList-con">
          <h1>{tab?.tabName}</h1>
          {canShowWriteButton && (
            <button onClick={handleWriteClick}>게시글 작성</button>
          )}
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => {
                // 전체 페이지 - 페이지*페이지당 수 - 현재 인덱스
                const displayId = totalElements - page * size - index;
                return (
                  <tr key={item.id || index}>
                    <td>{displayId}</td>
                    <td>{item.categoryName}</td>
                    <td
                      onClick={() => navigate(`/community/detail/${item.id}`)}
                    >
                      {item.title}
                    </td>
                    <td>{item.userName}</td>
                    <td>{item.hit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </button>
              <span>
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityList;
