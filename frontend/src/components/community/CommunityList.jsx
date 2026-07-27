import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../apis/commonApi";
import { getCookie } from "../../apis/util/cookieUtil";

/**
 * 게시글 목록 컴포넌트
 * - params(tabId, categoryId)로 필터링된 게시글을 페이지네이션하여 표시
 * - tab.adminOnly 여부에 따라 "게시글 작성" 버튼 노출 여부 결정
 * props:
 * - params: { tabId, categoryId } 조회 필터
 * - tab: 현재 선택된 탭 정보 { tabName, adminOnly }
 */
const CommunityList = ({ params, tab }) => {
  const [list, setList] = useState([]); // 현재 페이지의 게시글 목록
  const [page, setPage] = useState(0); // 0부터 시작 (Spring Pageable 기본)
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // 전체 게시글 수 (번호 계산에 사용)
  const size = 10; // 페이지당 게시글 수
  const navigate = useNavigate();
  const member = getCookie("member");
  const isAdmin = member?.role && String(member.role).toUpperCase() === "ADMIN";

  // "게시글 작성" 버튼 노출 여부: 관리자 전용 탭이면 관리자만, 아니면 누구나 노출
  // (실제 작성 가능 여부는 handleWriteClick에서 로그인/권한 재검증)
  const canShowWriteButton = useMemo(() => {
    if (!tab) return true;
    if (tab.adminOnly) {
      return isAdmin;
    }
    return true;
  }, [tab, isAdmin]);

  // 필터(탭/카테고리)가 바뀌면 페이지를 0으로 리셋
  useEffect(() => {
    setPage(0);
  }, [params]);

  // 필터 또는 페이지가 바뀔 때마다 목록 재조회
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

  // "게시글 작성" 버튼 클릭: 로그인 여부 및 관리자 전용 탭 권한 확인 후 작성 페이지로 이동
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
    // 현재 선택된 탭/카테고리를 state로 넘겨 작성 페이지에서 자동으로 채워지도록 함
    navigate("/community/insert", {
      state: { tabId: params?.tabId, categoryId: params?.categoryId },
    });
  };

  return (
    <>
      <div className="communityList">
        <div className="communityList-con">
          <h1>
            {tab?.tabName}
            {tab?.categoryName && ` > ${tab.categoryName}`}
          </h1>
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
                // 게시글 번호를 최신순으로 내림차순 표시하기 위한 계산
                // 전체 게시글 수 - (현재 페이지 * 페이지당 개수) - 행 인덱스
                const displayId = totalElements - page * size - index;
                return (
                  <tr key={item.id || index}>
                    <td>{displayId}</td>
                    <td>{item.categoryName}</td>
                    <td
                      onClick={() => navigate(`/community/detail/${item.id}`)}
                    >
                      {item.thumbnail ? (
                        <img
                          className="board-item-thumb"
                          src={item.thumbnail}
                          alt=""
                        />
                      ) : (
                        <div className="board-item-thumb board-item-thumb-empty" />
                      )}
                      <p>{item.title}</p>
                    </td>
                    <td>{item.userName}</td>
                    <td>{item.hit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 페이지네이션: 이전/다음 버튼 방식 (페이지가 2개 이상일 때만 표시) */}
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
