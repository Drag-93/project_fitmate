import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../apis/commonApi";

const TabDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //상세정보 보기
  const getTabDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_SERVER_URL}/community/tabDetail/${id}`,
      );
      if (res.data?.tab) {
        setTab(res.data.tab);
      }
    } catch (error) {
      alert("탭이 존재하지 않습니다");
      navigate("/community/tabList");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getTabDetail();
    }
  }, [id]);

  // ---- 카테고리 이름 수정 ----
  const handleCategoryNameChange = (index, value) => {
    const newList = [...(tab.categoryList || [])];
    newList[index] = { ...newList[index], categoryName: value };
    setTab({ ...tab, categoryList: newList });
  };

  // ---- 카테고리 삭제 (목록에서 제거만 하면, 제출 시 백엔드가 자동으로 삭제 처리) ----
  const handleCategoryDelete = (index) => {
    if (!window.confirm("이 카테고리를 삭제하시겠습니까?")) return;
    const newList = (tab.categoryList || []).filter((_, i) => i !== index);
    setTab({ ...tab, categoryList: newList });
  };

  // ---- 카테고리 추가 (id 없이 추가하면 백엔드가 신규 생성으로 처리) ----
  const handleCategoryAdd = () => {
    const newList = [
      ...(tab.categoryList || []),
      { id: null, categoryName: "" },
    ];
    setTab({ ...tab, categoryList: newList });
  };

  //탭 수정
  const getTabUpdate = async () => {
    // 빈 이름으로 저장되는 것 방지
    const hasEmptyName = (tab.categoryList || []).some(
      (cat) => !cat.categoryName?.trim(),
    );
    if (hasEmptyName) {
      alert("카테고리 이름을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.put(
        `${API_SERVER_URL}/community/tabUpdate/${id}`,
        tab,
      );
      alert("수정되었습니다.");
      navigate("/community/tabList");
    } catch (error) {
      console.error(error);
      alert("수정 실패");
    } finally {
      setIsLoading(false);
    }
  };

  //탭 삭제
  const getTabDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${API_SERVER_URL}/community/tabDelete/${id}`,
      );
      if (res.data?.result) {
        setTab(res.data.result);
        navigate("/community/tabList");
      }
    } catch (error) {
      alert("삭제 시도 중 오류가 발생했습니다");
      navigate("/community/tabList");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="tabDetail">
        <div className="tabDetail-con">
          <h1>탭 상세 페이지</h1>
          {isLoading ? (
            <p>데이터를 불러오는 중입니다</p>
          ) : tab ? (
            <div className="detailbody">
              <ul>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={tab.adminOnly || false}
                      onChange={(e) =>
                        setTab({ ...tab, adminOnly: e.target.checked })
                      }
                    />
                    관리자만 작성/삭제 가능 (공지사항용)
                  </label>
                </li>
                <li>
                  <label htmlFor="tabName">이름</label>
                  <input
                    type="text"
                    name="tabName"
                    value={tab.tabName || ""}
                    onChange={(e) =>
                      setTab({ ...tab, tabName: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label>카테고리</label>
                  <div className="category-edit-group">
                    {tab.categoryList?.map((cat, index) => (
                      <div
                        key={cat.id ?? `new-${index}`}
                        className="category-edit-row"
                      >
                        <input
                          type="text"
                          value={cat.categoryName}
                          placeholder="카테고리 이름"
                          onChange={(e) =>
                            handleCategoryNameChange(index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleCategoryDelete(index)}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={handleCategoryAdd}>
                      + 카테고리 추가
                    </button>
                  </div>
                </li>
                <li>
                  <label>생성일</label>
                  <div className="view-box">
                    {tab?.updateTime
                      ? `수정일: ${tab.updateTime?.split("T")[0]}`
                      : `생성일: ${tab?.createTime?.split("T")[0] || ""}`}
                  </div>
                </li>
                <li>
                  <button onClick={() => getTabUpdate()}>수정</button>
                </li>
              </ul>
              <div className="button">
                <button onClick={() => navigate("/community/tabList")}>
                  목록으로 돌아가기
                </button>
                <button onClick={() => getTabDelete()}>삭제</button>
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

export default TabDetail;
