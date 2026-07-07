import { useState } from "react";
import axios from "axios";
import { API_SERVER_URL } from "../../apis/commonApi";
import { Link, useNavigate } from "react-router-dom";
import "../css/auth/join.css";
const initUserData = {
  userEmail: "",
  userPw: "",
  userName: "",
  gender: "MALE",
};
const Join = () => {
  const navigate = useNavigate();
  // 회원가입정보를 담게될 변수
  const [joinData, setJoinData] = useState(initUserData);
  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setJoinData({ ...joinData, [name]: value });
  };

  //이메일 형식 체크를 위한 정규식 선언
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  const onJoinFn = async () => {
    if (!joinData.userEmail) {
      alert("이메일을 입력해주세요");
      return;
    }
    //이메일 형식에 맞지않는지 체크
    if (!emailRegex.test(joinData.userEmail.trim())) {
      alert("이메일 형식이 올바르지 않습니다.");
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
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("회원가입 통신 에러:", err);
      alert("서버 연결에 실패하였습니다.");
    }
  };
  return (
    <>
      <div className="join">
        <div className="join-con">
          <ul>
            <li>Join</li>
            <li>
              <input
                type="email"
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
              <Link to="/auth/login">로그인</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Join;
