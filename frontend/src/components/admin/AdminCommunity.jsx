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

const GROUP_SIZE = 5; // 탭별 섹션에서 한 번에 보여줄 개수 (필요시 조정)

const AdminCommunity = () => {
  const [openModal, setOpenModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    tabId: "",
    categoryId: "",
    keyword: "",
  });

  // ---- 단일 탭 선택 모드용 (기존 방식 그대로 유지) ----
  const [list, setList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const size = 20;

  // ---- 탭별 그룹 모드용 (탭 미선택 시 기본 화면) ----
  // { [tabId]: { list, page, totalPages, totalElements, isLoading, selectedIds } }
  const [groupedByTab, setGroupedByTab] = useState({});

  // 모달 상태
  const [writeTabId, setWriteTabId] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const pageGroupSize = 10;
  const currentGroup = Math.floor(page / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  // 탭이 하나라도 선택돼 있으면 "단일 탭 모드", 아니면 "탭별 그룹 모드"
  const isSingleTabMode = !!filters.tabId;

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

  // ---- 단일 탭 모드: 기존 로직 그대로 ----
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

  // ---- 탭별 그룹 모드: 탭마다 각각 tclist 호출 ----
  const fetchGroupedList = async (tabIdOverride, pageOverride) => {
    if (tabs.length === 0) return;

    const targets = tabIdOverride ? [tabIdOverride] : tabs.map((t) => t.id);

    // 대상 탭들의 로딩 상태를 먼저 true로 표시
    setGroupedByTab((prev) => {
      const next = { ...prev };
      targets.forEach((tabId) => {
        next[tabId] = {
          ...(next[tabId] || {
            list: [],
            page: 0,
            totalPages: 0,
            totalElements: 0,
            selectedIds: [],
          }),
          isLoading: true,
        };
      });
      return next;
    });

    await Promise.all(
      targets.map(async (tabId) => {
        const currentPage =
          pageOverride !== undefined && tabIdOverride === tabId
            ? pageOverride
            : groupedByTab[tabId]?.page || 0;

        try {
          const res = await jwtAxios.get(`${API_SERVER_URL}/community/tclist`, {
            params: {
              tabId,
              keyword: filters.keyword || undefined,
              page: currentPage,
              size: GROUP_SIZE,
            },
          });
          const {
            content,
            totalPages: tp,
            totalElements: te,
          } = res.data.result;

          setGroupedByTab((prev) => ({
            ...prev,
            [tabId]: {
              list: content || [],
              page: currentPage,
              totalPages: tp || 0,
              totalElements: te || 0,
              selectedIds: [],
              isLoading: false,
            },
          }));
        } catch (error) {
          setGroupedByTab((prev) => ({
            ...prev,
            [tabId]: {
              ...(prev[tabId] || {}),
              list: [],
              isLoading: false,
            },
          }));
        }
      }),
    );
  };

  // 탭이 로드되고, 단일 탭 모드가 아닐 때 그룹 목록 초기 로드
  useEffect(() => {
    if (!isSingleTabMode && tabs.length > 0) {
      fetchGroupedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, isSingleTabMode]);

  // 단일 탭 모드 목록 로드
  useEffect(() => {
    if (isSingleTabMode) {
      fetchList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isSingleTabMode]);

  const handleSearch = () => {
    if (isSingleTabMode) {
      if (page === 0) {
        fetchList();
      } else {
        setPage(0);
      }
    } else {
      fetchGroupedList();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "tabId") {
      setFilters((prev) => ({ ...prev, tabId: value, categoryId: "" }));
      setPage(0);
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

  // 탭별 그룹 섹션의 페이지 변경
  const handleGroupPageChange = (tabId, newPage) => {
    fetchGroupedList(tabId, newPage);
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

  // ---- 단일 탭 모드 선택/삭제 ----
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(list.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // ---- 탭별 그룹 모드 선택/삭제 ----
  const toggleGroupSelect = (tabId, id) => {
    setGroupedByTab((prev) => {
      const group = prev[tabId];
      if (!group) return prev;
      const nextSelected = group.selectedIds.includes(id)
        ? group.selectedIds.filter((v) => v !== id)
        : [...group.selectedIds, id];
      return {
        ...prev,
        [tabId]: { ...group, selectedIds: nextSelected },
      };
    });
  };

  const toggleGroupSelectAll = (tabId, e) => {
    setGroupedByTab((prev) => {
      const group = prev[tabId];
      if (!group) return prev;
      const nextSelected = e.target.checked
        ? group.list.map((item) => item.id)
        : [];
      return {
        ...prev,
        [tabId]: { ...group, selectedIds: nextSelected },
      };
    });
  };

  const handleGroupDeleteSelected = async (tabId) => {
    const group = groupedByTab[tabId];
    if (!group || group.selectedIds.length === 0) {
      alert("삭제할 게시글을 선택해주세요");
      return;
    }
    if (
      !window.confirm(
        `선택한 ${group.selectedIds.length}개 게시글을 삭제하시겠습니까?`,
      )
    )
      return;

    try {
      const results = await Promise.allSettled(
        group.selectedIds.map((id) =>
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
      fetchGroupedList(tabId, group.page);
    } catch (error) {
      alert("일괄 삭제 중 오류가 발생했습니다");
    }
  };

  const refreshAfterDelete = () => {
    if (isSingleTabMode) {
      fetchList();
    } else {
      fetchGroupedList();
    }
  };

  const handleDeleteOne = async (id) => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await jwtAxios.delete(`${API_SERVER_URL}/community/adminDelete/${id}`);
      alert("삭제되었습니다");
      refreshAfterDelete();
    } catch (error) {
      alert("삭제 실패");
    }
  };

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

  // ---- 공통 테이블 렌더링 함수 (단일/그룹 모드에서 재사용) ----
  const renderTable = ({
    rows,
    isLoading: loading,
    selectedIds: rowSelectedIds,
    onToggleSelect,
    onToggleSelectAll,
    showTabColumn,
  }) => {
    if (loading) {
      return <p>목록을 불러오는 중입니다</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  rows.length > 0 && rowSelectedIds.length === rows.length
                }
                onChange={onToggleSelectAll}
              />
            </th>
            <th>번호</th>
            {showTabColumn && <th>탭</th>}
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={showTabColumn ? 9 : 8}>게시글이 없습니다</td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={rowSelectedIds.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>
                <td>{item.id}</td>
                {showTabColumn && <td>{item.tabName}</td>}
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
            ))
          )}
        </tbody>
      </table>
    );
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
            <option value="">탭별로 보기 (전체)</option>
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

        {isSingleTabMode ? (
          <>
            {/* ---------- 단일 탭 모드 (기존 방식) ---------- */}
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

            {renderTable({
              rows: list,
              isLoading,
              selectedIds,
              onToggleSelect: toggleSelect,
              onToggleSelectAll: toggleSelectAll,
              showTabColumn: false,
            })}

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
          </>
        ) : (
          <>
            {/* ---------- 탭별 그룹 모드 (탭 미선택 시 기본 화면) ---------- */}
            {tabs.map((tab) => {
              const group = groupedByTab[tab.id] || {
                list: [],
                page: 0,
                totalPages: 0,
                totalElements: 0,
                isLoading: true,
              };

              const groupCurrentGroup = Math.floor(group.page / pageGroupSize);
              const groupStartPage = groupCurrentGroup * pageGroupSize + 1;
              const groupEndPage = Math.min(
                groupStartPage + pageGroupSize - 1,
                group.totalPages,
              );

              return (
                <section key={tab.id} className="admin-tab-section">
                  <div className="admin-tab-section-header">
                    <h2>
                      {tab.tabName}{" "}
                      <span className="admin-tab-count">
                        ({group.totalElements}건)
                      </span>
                    </h2>
                    <div className="admin-action-row">
                      <span>{group.selectedIds?.length || 0}건 선택</span>
                      <button
                        type="button"
                        onClick={() => handleGroupDeleteSelected(tab.id)}
                        disabled={!group.selectedIds?.length}
                      >
                        선택 삭제
                      </button>
                    </div>
                  </div>

                  {renderTable({
                    rows: group.list,
                    isLoading: group.isLoading,
                    selectedIds: group.selectedIds || [],
                    onToggleSelect: (id) => toggleGroupSelect(tab.id, id),
                    onToggleSelectAll: (e) => toggleGroupSelectAll(tab.id, e),
                    showTabColumn: false,
                  })}

                  {group.totalPages > 1 && (
                    <PageGenerate
                      currentPage={group.page}
                      startPage={groupStartPage}
                      endPage={groupEndPage}
                      totalPage={group.totalPages}
                      onPageChange={(search, subject, newPage) =>
                        handleGroupPageChange(tab.id, newPage)
                      }
                      search={filters.keyword}
                      subject={tab.id}
                    />
                  )}
                </section>
              );
            })}
          </>
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
            refreshAfterDelete();
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
            refreshAfterDelete();
          }}
        />
      )}
    </div>
  );
};

export default AdminCommunity;
