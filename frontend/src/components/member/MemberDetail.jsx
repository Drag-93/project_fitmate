import React, { useEffect, useState } from "react";

import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/loginSlice";

const API_URL = API_SERVER_URL;

const MemberDetail = () => {
  const member = useSelector((state) => state.loginSlice);
  const isLogin = !!member?.userEmail;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [memberData, setMemberData] = useState(null);

  const getMemberDetail = async () => {
    const res = await jwtAxios.get(`${API_URL}/api/member/detail`);
    return res.data;
  };

  const memberDelete = async () => {
    if (!confirm("회원탈퇴를 하시겠습니까?")) return;
    try {
      const res = await jwtAxios.delete(`${API_URL}/api/member/quit`);
      if (res.data === "ok") {
        dispatch(logout());
        alert("회원탈퇴 성공");
        navigate("/");
      } else {
        alert("회원탈퇴에 실패하였습니다.");
      }
    } catch (err) {
      console.log(err);
      alert("회원탈퇴중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (isLogin) {
      getMemberDetail()
        .then((data) => setMemberData(data.result))
        .catch((err) => console.error(err));
    }
  }, [isLogin]);
  return (
    <>
      <div className="memberDetail">
        <div className="memberDetail-con">
          <div className="memberInfo">
            <ul>
              {memberData !== null ? (
                <>
                  <li>
                    <h1>{memberData.userName}님</h1>
                  </li>
                  <li className="profilePhoto">
                    <span>프로필사진</span>
                    <span>{memberData.profilePhoto}</span>
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
                    <span>구독여부</span>
                    <span>{memberData.subscribe}</span>
                  </li>
                  <li>
                    <span>
                      <button>개인정보수정</button>
                    </span>
                    <span>
                      <button onClick={memberDelete}>회원탈퇴</button>
                    </span>
                  </li>
                </>
              ) : (
                <>회원님의 정보를 불러오는 중입니다...</>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;
