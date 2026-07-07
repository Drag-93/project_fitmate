import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        `http://localhost:8090/community/tabDetail/${id}`,
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

  //탭 수정
  const getTabUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `http://localhost:8090/community/tabUpdate/${id}`,
        tab,
      );
      alert("수정되었습니다.");
      navigate("/community/tabList");
      // 2. 수정 후 상세 페이지를 다시 불러오거나 목록으로 이동
    } catch (error) {
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
        `http://localhost:8090/community/tabDelete/${id}`,
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
                  <label htmlFor="tabName">이름</label>
                  <input
                    type="text"
                    name="tabName"
                    value={tab.tabName || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) =>
                      setTab({ ...tab, tabName: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label>카테고리</label>
                  <div className="checkbox-group">
                    {/* 1. 서버에서 가져온 전체 카테고리 목록(categoryList)을 매핑 */}
                    {tab.categoryList?.map((cat) => (
                      <label key={cat.id}>
                        <input
                          type="checkbox"
                          value={cat.categoryName}
                          // 2. 현재 선택된 목록(categoryNames)에 이 이름이 포함되어 있으면 체크
                          checked={tab.categoryNames?.includes(
                            cat.categoryName,
                          )}
                          onChange={(e) => {
                            const { checked, value } = e.target;

                            // 기존 선택 목록을 가져와서 업데이트
                            const currentNames = tab.categoryNames || [];

                            const newNames = checked
                              ? [...currentNames, value] // 체크 시 추가
                              : currentNames.filter((name) => name !== value); // 해제 시 제거

                            setTab({ ...tab, categoryNames: newNames });
                          }}
                        />
                        {cat.categoryName}
                      </label>
                    ))}
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
