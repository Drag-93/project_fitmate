import React, { useEffect, useState } from "react";

import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/loginSlice";

const API_URL = API_SERVER_URL;

const MemberDetail = () => {
  //authSlice에 저장된 멤버데이터를 가져옴
  const member = useSelector((state) => state.loginSlice);

  //member의 userEmail여부로 로그인이 되었는지 확인
  const isLogin = !!member?.userEmail;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //처음 멤버데이터를 집어넣고, 마이페이지에 보여줄 데이터
  const [memberData, setMemberData] = useState(null);

  //멤버데이터 수정 여부
  const [isUpdate, setIsUpdate] = useState(false);
  //멤버데이터를 수정할 때 따로 수정데이터를 조작할 수 있게 설정
  const [updateData, setUpdateData] = useState(null);

  //이메일 정규식
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  //처음 시작 시 멤버데이터를 불러오기 위한 비동기 함수
  const getMemberDetail = async () => {
    //jwtAxios => jwtUtil의 axios함수(jwt토큰 중 access토큰과 refresh토큰을 비교하여 데이터를 불러옴)
    const res = await jwtAxios.get(`${API_URL}/api/member/detail`);
    return res.data;
  };

  const memberUpdateFn = () => {
    if (!isUpdate) {
      setUpdateData({ ...memberData, userPw: "" });
    } else {
      memberUpdate();
    }
    setIsUpdate((prev) => !prev);
  };

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setModifyData({ ...updateData, [name]: value });
  };

  const memberUpdate = async () => {
    if (!confirm("회원수정을 하시겠습니까?")) return;
    try {
      //이메일 형식에 맞지않는지 체크
      if (!emailRegex.test(updateData.userEmail.trim())) {
        alert("이메일 형식이 올바르지 않습니다.");
        return;
      }
      if (!updateData.userPw) {
        alert("비밀번호 입력해주세요");
        return;
      }
      if (!updateData.userName) {
        alert("이름을 입력해주세요");
        return;
      }
      const formData = new FormData();
      formData.append("userEmail", joinData.userEmail);
      formData.append("userPw", joinData.userPw);
      formData.append("userName", joinData.userName);
      formData.append("gender", joinData.gender);
      const res = await jwtAxios.put(`${API_URL}/api/member/update`);
      if (updateData.userEmail !== memberData.userEmail) {
        dispatch(logout());
        alert("회원가입에 성공하였습니다.");
        navigate("/");
      } else {
        navigate("/mypage");
      }
    } catch (err) {
      console.log(err);
      alert("회원탈퇴중 오류가 발생했습니다.");
    }
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

  //처음 마이페이지 접속 시 authSlice에 저장된 member의 유저이메일의 유무로 데이터 가져오기
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
              {memberData === null ? (
                <>회원님의 정보를 불러오는 중입니다...</>
              ) : !isUpdate ? (
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
                      <button
                        onClick={() =>
                          navigate("/mypage/updatepw", {
                            state: { getData: memberData },
                          })
                        }
                      >
                        비밀번호변경
                      </button>
                    </span>
                    <span>
                      <button onClick={memberUpdateFn}>개인정보수정</button>
                    </span>
                    <span>
                      <button onClick={memberDelete}>회원탈퇴</button>
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <h1>
                      <input
                        type="text"
                        value={updateData.userName}
                        onChange={onChangeFn}
                      />
                    </h1>
                  </li>
                  <li className="profilePhoto">
                    <span>프로필사진</span>
                    <span>{updateData.profilePhoto}</span>
                  </li>
                  <li>
                    <span>이메일</span>
                    <span>
                      <input
                        type="email"
                        value={updateData.userEmail}
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>주소</span>
                    <span>
                      <input
                        type="text"
                        value={updateData.userAddress}
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>전화번호</span>
                    <span>
                      <input
                        type="text"
                        value={updateData.userPhone}
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>
                      <button onClick={memberUpdateFn}>개인정보수정</button>
                    </span>
                    <span>
                      <button onClick={() => setIsUpdate((prev) => !prev)}>
                        취소
                      </button>
                    </span>
                    <span>
                      <button onClick={memberDelete}>회원탈퇴</button>
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;
