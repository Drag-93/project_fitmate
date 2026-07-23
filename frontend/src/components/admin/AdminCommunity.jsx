import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil.jsx";
import { API_SERVER_URL } from "../../apis/commonApi";
import "../css/admin/AdminCommunity.css";
import { getCookie } from "../../apis/util/cookieUtil";
import TabList from "../community/TabList.jsx";
import PageGenerate from "../common/Page/PageGenerate.jsx";
import AdminNoticeWrite from "./community/AdminNoticeWrite.jsx";
import AdminCommunityDetail from "./community/AdminCommunityDetail.jsx";

const AdminCommunity = () => {
  const [openModal, setOpenModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    tabId: "",
    categoryId: "",
    keyword: "",
  });

  const [list, setList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const size = 20;

  // 모달 상태
  const [writeTabId, setWriteTabId] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const pageGroupSize = 10;
  const currentGroup = Math.floor(page / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  useEffect(() => {
    const fetchTcList = async () => {
      try {
        const [tabRes, catRes] = await Promise.all([
          axios.get(`${API_SERVER_URL}/community/tabList`),
          axios.get(`${API_SERVER_URL}/community/category`),
        ]);
        setTabs(tabRes.data.result || []);
        setCategories(catRes.data.result || []);
      } catch (err) {
        console.error("탭/카테고리 로드 실패", err);
      }
    };
    fetchTcList();
  }, []);

  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) => String(cat.tabId) === String(filters.tabId)),
    [filters.tabId, categories],
  );

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const res = await jwtAxios.get(`${API_SERVER_URL}/community/tclist`, {
        params: {
          tabId: filters.tabId || undefined,
          categoryId: filters.categoryId || undefined,
          keyword: filters.keyword || undefined,
          page,
          size,
        },
      });
      const { content, totalPages: tp, totalElements: te } = res.data.result;
      setList(content || []);
      setTotalPages(tp || 0);
      setTotalElements(te || 0);
      setSelectedIds([]);
    } catch (error) {
      alert("목록을 불러오지 못했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  const handleSearch = () => {
    if (page === 0) {
      fetchList();
    } else {
      setPage(0);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "tabId") {
      setFilters((prev) => ({ ...prev, tabId: value, categoryId: "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  //엔터키 적용
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (search, subject, newPage) => {
    setPage(newPage);
  };

  // 작성 모달 오픈
  const noticeWrite = () => {
    const noticeTab = tabs.find((tab) => tab.adminOnly);
    if (!noticeTab) {
      alert("공지사항 탭이 존재하지 않습니다. 탭 관리에서 먼저 생성해주세요.");
      return;
    }
    setWriteTabId(noticeTab.id);
  };
  // 선택
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };
  //전체 선택
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(list.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };
  //게시글 1개 삭제
  const handleDeleteOne = async (id) => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await jwtAxios.delete(`${API_SERVER_URL}/community/adminDelete/${id}`);
      alert("삭제되었습니다");
      fetchList();
    } catch (error) {
      alert("삭제 실패");
    }
  };
  //선택 게시글 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 게시글을 선택해주세요");
      return;
    }
    if (
      !window.confirm(
        `선택한 ${selectedIds.length}개 게시글을 삭제하시겠습니까?`,
      )
    )
      return;

    try {
      const results = await Promise.allSettled(
        selectedIds.map((id) =>
          jwtAxios.delete(`${API_SERVER_URL}/community/adminDelete/${id}`),
        ),
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        alert(
          `${failed.length}건 삭제 실패, ${results.length - failed.length}건 삭제 완료`,
        );
      } else {
        alert("삭제되었습니다");
      }
      fetchList();
    } catch (error) {
      alert("일괄 삭제 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="comMain">
      <div className="comMain-wrap">
        <h1>게시글 관리</h1>
        <div className="write">
          <button type="button" onClick={noticeWrite}>
            공지사항 작성
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="admin-filter-row">
          <select
            name="tabId"
            value={filters.tabId}
            onChange={handleFilterChange}
          >
            <option value="">전체 탭</option>
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.tabName}
              </option>
            ))}
          </select>

          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            disabled={!filters.tabId}
          >
            <option value="">전체 카테고리</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="keyword"
            placeholder="제목 또는 작성자 검색"
            value={filters.keyword}
            onChange={handleFilterChange}
            onKeyDown={handleKeyDown}
          />

          <button type="button" onClick={handleSearch}>
            검색
          </button>
        </div>

        {/* 일괄 작업 영역 */}
        <div className="admin-action-row">
          <span>
            총 {totalElements}건 중 {selectedIds.length}건 선택
          </span>
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            선택 삭제
          </button>
        </div>
        {/* 내용부 */}
        {isLoading ? (
          <p>목록을 불러오는 중입니다</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      list.length > 0 && selectedIds.length === list.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>번호</th>
                <th>탭</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={9}>게시글이 없습니다</td>
                </tr>
              ) : (
                list.map((item, index) => {
                  const displayId = totalElements - page * size - index;
                  return (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td>{displayId}</td>
                      <td>{item.tabName}</td>
                      <td>{item.categoryName}</td>
                      <td
                        className="admin-title-cell"
                        onClick={() => setDetailId(item.id)}
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
                      <td>{item.createTime?.split("T")[0] || ""}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteOne(item.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* 페이징 */}
        {totalPages > 1 && (
          <PageGenerate
            currentPage={page}
            startPage={startPage}
            endPage={endPage}
            totalPage={totalPages}
            onPageChange={handlePageChange}
            search={filters.keyword}
            subject={filters.tabId}
          />
        )}

        <div className="tabList">
          <TabList />
        </div>
      </div>

      {/* 작성 모달 */}
      {writeTabId && (
        <AdminNoticeWrite
          tabId={writeTabId}
          tabs={tabs}
          categories={categories}
          onClose={() => setWriteTabId(null)}
          onSuccess={() => {
            setWriteTabId(null);
            fetchList();
          }}
        />
      )}

      {/* 상세보기 모달 */}
      {detailId && (
        <AdminCommunityDetail
          id={detailId}
          onClose={() => setDetailId(null)}
          onDeleted={() => {
            setDetailId(null);
            fetchList();
          }}
        />
      )}
    </div>
  );
};

export default AdminCommunity;
