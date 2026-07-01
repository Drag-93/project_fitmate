import React, { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import axios from "axios";
import { API_SERVER_URL } from "../../apis/commonApi";
import { useNavigate } from "react-router-dom";

const initUserData = {
  userEmail: "",
  userPw: "",
  userName: "",
  gender: "MALE",
};
const JoinPage = () => {
  const navigate = useNavigate();
  // 회원가입정보를 담게될 변수
  const [joinData, setJoinData] = useState(initUserData);
  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setJoinData({ ...joinData, [name]: value });
  };
  const onJoinFn = async () => {
    if (!joinData.userEmail) {
      alert("이메일을 입력해주세요");
      return;
    }
    if (!joinData.userPw) {
      alert("비밀번호 입력해주세요");
      return;
    }
    if (!joinData.userName) {
      alert("이름을 입력해주세요");
      return;
    }
    const formData = new FormData();
    formData.append("userEmail", joinData.userEmail);
    formData.append("userPw", joinData.userPw);
    formData.append("userName", joinData.userName);
    formData.append("gender", joinData.gender);

    try {
      const res = await axios.post(
        `${API_SERVER_URL}/api/member/join`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.data === "ok") {
        alert("회원가입 성공!");
        navigate("/login");
      }
    } catch (err) {
      console.error("회원가입 통신 에러:", err);
      alert("서버 연결에 실패하였습니다.");
    }
  };
  const onLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <Header />
      <div className="join">
        <div className="join-con">
          <ul>
            <li>Login</li>
            <li>
              <input
                type="text"
                name="userEmail"
                id="userEmail"
                placeholder="이메일을 입력해주세요"
                value={joinData.userEmail}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <input
                type="password"
                name="userPw"
                id="userPw"
                placeholder="비밀번호를 입력해주세요"
                value={joinData.userPw}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="이름을 입력해주세요"
                value={joinData.userName}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <span>성별</span>
              <select
                name="gender"
                id="gender"
                onChange={onChangeFn}
                value={joinData.gender}
              >
                <option value="MALE">남자</option>
                <option value="FEMALE">여자</option>
              </select>
            </li>
            <li>
              <button onClick={onJoinFn}>회원가입</button>
              <button onClick={onLogin}>로그인</button>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JoinPage;
