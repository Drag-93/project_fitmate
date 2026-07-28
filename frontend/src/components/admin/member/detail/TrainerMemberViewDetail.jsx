import React, { useEffect, useState } from "react";
import jwtAxios from "../../../../apis/util/jwtUtil";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../../../apis/commonApi";

const TrainerMemberViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState(null);
  const getMemberList = async () => {
    const url = `${API_SERVER_URL}/api/member/admin/summary/${id}`;
    try {
      const res = await jwtAxios.get(url);
      setMemberData(res.data.result);
      console.log(res.data);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };
  useEffect(() => {
    getMemberList();
  }, []);
  return memberData !== null ? (
    <>
      <div className="memberDetail-con">
        <ul>
          <li>
            <span>
              <h1>{memberData.userName} 프로필</h1>
            </span>
          </li>
          <li>
            <span>이메일</span>
            <span>{memberData.userEmail}</span>
          </li>
          <li>
            <span>주소</span>
            <span>{memberData.userAddress}</span>
          </li>
          <li>
            <span>전화번호</span>
            <span>{memberData.userPhone}</span>
          </li>
          <li>
            <span>프로필사진</span>
            <span className="profilePhoto">
              {memberData.newFileName ? (
                //파일을 아직 고르지 않았을때 & 기존에 저장된 이미지가 있을경우(기존 이미지)
                <img
                  src={`${API_SERVER_URL}/upload/member/${memberData.newFileName}`}
                  alt="프로필 사진"
                  className="prev-img"
                />
              ) : (
                //기존이미지도 없고 선택도 안했을경우(기본 이미지 추가)
                <img
                  src="/images/member/wanderercreative-blank-profile-picture-973460.svg"
                  alt="기본이미지"
                  className="prev-img"
                />
              )}
            </span>
          </li>
          <li>
            <span>구독여부</span>
            <span>{memberData.subscribe === 0 ? "X" : "O"}</span>
          </li>
        </ul>
        <ul>
          <li>
            <h1>회원 상세정보</h1>
          </li>
          <li>
            <span>관심사</span>
            <span>{memberData.interest || "정보 없음"}</span>
          </li>
          <li>
            <span>키</span>
            <span>
              {memberData.height ? `${memberData.weight} cm` : "정보 없음"}
            </span>
          </li>
          <li>
            <span>몸무게</span>
            <span>
              {memberData.weight ? `${memberData.weight} kg` : "정보 없음"}
            </span>
          </li>
          <li>
            <span>목표몸무게</span>
            <span>
              {memberData.goalWeight
                ? `${memberData.goalWeight} kg`
                : "정보 없음"}
            </span>
          </li>
          <li>
            <span>출석체크</span>
            <span>{memberData.dailyCheck || "정보 없음"}</span>
          </li>
          <li>
            <span>뱃지</span>
            <span>{memberData.badge || "정보 없음"}</span>
          </li>
        </ul>
        <ul>
          <li>
            <button onClick={() => navigate("/admin/member")}>뒤로가기</button>
          </li>
        </ul>
      </div>
    </>
  ) : (
    <>회원정보를 불러오는 중입니다.</>
  );
};

export default TrainerMemberViewDetail;
