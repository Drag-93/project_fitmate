import React, { useEffect, useState } from "react";
import { API_SERVER_URL } from "../../../apis/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageGenerate from "../../common/Page/PageGenerate";
import jwtAxios from "../../../apis/util/jwtUtil";

const TrainerMemberView = () => {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");

  //관심사를 한글로 바꿔주기위한 상수
  const interestMap = {
    DIET: "다이어트",
    WORKOUT: "운동",
    HEALTH: "건강관리",
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    getMemberList(subject, search, 0);
    // 선택된 조건이 없거나 검색어가 비어있으면 전체 목록으로 이동하거나 알림 처리
    // if (!subject && search) {
    //   alert("검색 필터를 선택해주세요.");
    //   return;
    // }
  };
  const getMemberList = async (subject, search, page) => {
    //있을때나 없을때나 실행할수있게 설정
    const url = `${API_SERVER_URL}/api/member/admin/memberListSummary?page=${page}&size=5&subject=${subject ? subject : ""}&search=${encodeURIComponent(search ? search : "")}`;
    try {
      const res = await jwtAxios.get(url);
      setMemberData(res.data);
      console.log(res.data);
      console.log(url);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };
  useEffect(() => {
    getMemberList("", "", 0);
  }, []);

  return (
    <>
      {memberData !== null ? (
        <>
          <div className="search">
            <div className="filters">
              <form onSubmit={handleSearchSubmit}>
                <select
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">::선택::</option>
                  <option value="userName">이름</option>
                  <option value="interest">관심사</option>
                </select>

                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="검색어를 입력하세요"
                />

                <input type="submit" value="검색" />
              </form>
            </div>
          </div>
          <div className="memberList">
            <ul className="memberList-head">
              <li>이름</li>
              <li>관심사</li>
              <li>구독여부</li>
              <li>상세보기</li>
            </ul>
            {memberData?.memberList?.map((el, idx) => {
              return (
                <ul className="memberList-body" key={el.id}>
                  <li>{el.userName}</li>
                  <li>{interestMap[el.interest] ?? "없음"}</li>
                  <li>{el.subscribe === 0 ? "X" : "O"}</li>
                  <li onClick={() => navigate(`/admin/member/detail/${el.id}`)}>
                    {el.userName}
                  </li>
                </ul>
              );
            })}
            <ul className="memberList-foot">
              <PageGenerate
                currentPage={memberData.currentPage} //현재 페이지
                startPage={memberData.startPage} //시작 페이지
                endPage={memberData.endPage} //끝 페이지
                totalPage={memberData.totalPage} //전체 페이지
                onPageChange={getMemberList} //리스트를 불러오는 함수
                search={search} //검색어
                subject={subject} //검색필터
              />
            </ul>
          </div>
        </>
      ) : (
        <>회원정보를 불러오는 중입니다.</>
      )}
    </>
  );
};

export default TrainerMemberView;
