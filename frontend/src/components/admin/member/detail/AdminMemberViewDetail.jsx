import React, { useEffect, useState } from "react";
import jwtAxios from "../../../../apis/util/jwtUtil";
import { useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../../../apis/commonApi";

const AdminMemberViewDetail = () => {
  const { id } = useParams();

  const [memberData, setMemberData] = useState(null);
  const getMemberList = async () => {
    const url = `${API_SERVER_URL}/api/member/detail/${id}`;
    try {
      const res = await jwtAxios.get(url);
      setMemberData(res.data.result);
      // console.log(res.data);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };
  useEffect(() => {
    getMemberList();
  }, []);
  return (
    <>
      {memberData !== null ? (
        <>
          <div className="memberDetail-con">
            <ul>
              <li>
                <span>고유번호</span>
                <span>{memberData.id}</span>
              </li>
              <li>
                <span>이름</span>
                <span>{memberData.userName}</span>
              </li>
              <li>
                <span>이메일</span>
                <span>{memberData.userEmail}</span>
              </li>
              <li>
                <span>비밀번호</span>
                <span>{memberData.userPw}</span>
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
                <span>구독여부</span>
                <span>{memberData.subscribe}</span>
              </li>
              <li>
                <span>프로필사진</span>
                <span>
                  {memberData.newFileName ? (
                    <img
                      src={`${API_URL}/upload/member/${member.newFileName}`}
                      alt="프로필 사진"
                    />
                  ) : (
                    <img
                      src="/images/member/wanderercreative-blank-profile-picture-973460.svg"
                      alt="기본 프로필 사진"
                    />
                  )}
                </span>
              </li>
              <li>
                <span>권한</span>
                <span>{memberData.role}</span>
              </li>
              <li>
                <span>수정</span>
                <span>삭제</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>회원정보를 불러오는 중입니다.</>
      )}
    </>
  );
};

export default AdminMemberViewDetail;
