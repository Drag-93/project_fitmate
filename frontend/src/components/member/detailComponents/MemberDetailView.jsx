import React from "react";
import { API_SERVER_URL } from "../../../apis/commonApi";
import { Link } from "react-router-dom";

const MemberDetailView = ({ member, updateFn, memberDelete, navigate }) => {
  //관심사를 한글로 바꿔주기위한 상수
  const interestMap = {
    DIET: "다이어트",
    WORKOUT: "운동",
    HEALTH: "건강관리",
  };
  return (
    <div className="memberDetailContainer">
      {/* 1. 상단 프로필 헤더 */}
      <div className="profileHeader">
        <div className="profilePhoto">
          {member.newFileName ? (
            <img
              src={`${API_SERVER_URL}/upload/member/${member.newFileName}`}
              alt="프로필 사진"
            />
          ) : (
            <img
              src="/images/member/wanderercreative-blank-profile-picture-973460.svg"
              alt="기본 프로필 사진"
            />
          )}
        </div>
        <div className="profileName">
          <h1>{member.userName} 님</h1>
          <span className="subscribeBadge">
            {member.subscribe === 0 ? "미구독" : "구독중"}
          </span>
        </div>
      </div>

      {/* 2. 기본 계정 정보 섹션 */}
      <div className="infoSection">
        <h3>기본 정보</h3>
        <ul className="infoGrid">
          <li>
            <span className="label">이메일</span>
            <span className="value">{member?.userEmail}</span>
          </li>
          <li>
            <span className="label">전화번호</span>
            <span className="value">{member?.userPhone || "정보 없음"}</span>
          </li>
          <li className="fullWidth">
            <span className="label">주소</span>
            <span className="value">{member?.userAddress || "정보 없음"}</span>
          </li>
        </ul>
      </div>

      {/* 3. 새로 추가할 5개 데이터 섹션 (신체 & 운동 프로필) */}
      <div className="infoSection">
        <h3>신체 & 운동 프로필</h3>
        <ul className="infoGrid">
          <li>
            <span className="label">신장</span>
            <span className="value">
              {member.height ? `${member.height} cm` : "정보 없음"}
            </span>
          </li>
          <li>
            <span className="label">현재 체중</span>
            <span className="value">
              {member.weight ? `${member.weight} kg` : "정보 없음"}
            </span>
          </li>
          <li>
            <span className="label">목표 체중</span>
            <span className="value">
              {member.goalWeight ? `${member.goalWeight} kg` : "정보 없음"}
            </span>
          </li>
          <li>
            <span className="label">관심 분야</span>
            <span className="value">
              {interestMap[member.interest] ?? "없음"}
            </span>
          </li>
          <li>
            <span className="label">보유 뱃지</span>
            <span className="value">{member.badge || "없음"}</span>
          </li>
          <li>
            <span className="label">출석체크 횟수</span>
            <span className="value">{member.dailyCheck}회</span>
          </li>
        </ul>
      </div>

      {/* 4. 빠른 링크 메뉴 */}
      <div className="infoSection">
        <h3>서비스 바로가기</h3>
        <ul className="linkList">

          {member?.role === "TRAINER" ? (
            <>
              <li><Link to="/trainer/pt">PT 예약 관리</Link></li>
              <li><Link to="/trainer/profile">프로필 관리</Link></li>
              <li><Link to="/trainer/schedule">수업 일정</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/mypage/orderList">주문내역</Link>
              </li>
              <li>
                <Link to="/mypage/subscription">FitMate Plus+</Link>
              </li>
              <li>
                <Link to="/mypage/pt">PT 관리</Link>
              </li>
              <li>
                <Link to="/mypage/memberships">이용권 관리</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* 5. 하단 버튼 영역 */}
      <div className="buttonArea">
        <button
          className="scheduleBtn"
          onClick={() => navigate("/mypage/schedule")}
        >
          스케줄
        </button>
        <button
          className="pwBtn"
          onClick={() =>
            navigate("/mypage/updatepw", { state: { getData: member } })
          }
        >
          비밀번호 변경
        </button>
        <button className="updateBtn" onClick={updateFn}>
          개인정보 수정
        </button>
        <button className="deleteBtn" onClick={memberDelete}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default MemberDetailView;
