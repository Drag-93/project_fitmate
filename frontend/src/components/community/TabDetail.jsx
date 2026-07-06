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
      console.log("상세 데이터 응답 : ", res.data);
      if (res.data?.tab) {
        setTab(res.data.tab);
      }
    } catch (error) {
      console.error("상세 정보 로드 실패 : ", error);
      alert("탭이 존재하지 않습니다");
      navigate("/community/tabList");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTabDetail();
  }, [id]);

  //탭 수정
  const getTabUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `http://localhost:8090/community/tabUpdate/${id}`,
        community,
      );
      alert("수정되었습니다.");
      navigatge("/community/tabList");
      // 2. 수정 후 상세 페이지를 다시 불러오거나 목록으로 이동
    } catch (error) {
      console.error("수정 실패 : ", error);
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
      console.log("상세 데이터 응답 : ", res.data);
      if (res.data?.result) {
        setCommunity(res.data.result);
      }
    } catch (error) {
      console.error("삭제 실패 : ", error);
      alert("삭제 시도 중 오류가 발생했습니다");
      navigatge("/community/tabList");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="tabDetail">
        <div className="tabDetail-con">
          <h1>게시글 상세 페이지</h1>
          {isLoading ? (
            <p>데이터를 불러오는 중입니다</p>
          ) : tab ? (
            <div className="detailbody">
              <ul>
                <li>
                  <label htmlFor="title">제목</label>
                  <input
                    type="text"
                    name="title"
                    value={tab.title || ""} // 데이터가 들어오기 전 에러 방지
                    onChange={(e) => setTab({ ...tab, title: e.target.value })}
                  />
                </li>
                <li>
                  <label htmlFor="content">내용</label>
                  <textarea
                    name="content"
                    value={tab.content || ""}
                    onChange={(e) =>
                      setTab({ ...tab, content: e.target.value })
                    }
                  />
                </li>
                <li>
                  <label>날짜</label>
                  <div className="view-box">
                    {tab.updateTime
                      ? `수정일: ${tab.updateTime.split("T")[0]}`
                      : `작성일: ${tab.createTime.split("T")[0] || ""}`}
                  </div>
                </li>
                <li>
                  <button onClick={() => getTabUpdate()}>수정</button>
                </li>
              </ul>
              <div className="button">
                <button onClick={() => navigatge("/community/tabList")}>
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
