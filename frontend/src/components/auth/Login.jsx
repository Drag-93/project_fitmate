import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  loadMemberInit,
  loginPostAsync,
  logout,
} from "../../store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import "../css/auth/login.css";
import { API_SERVER_URL } from "../../apis/commonApi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // product
  const location = useLocation();

  const { memberData } = useSelector((state) => state.loginSlice);
  //이메일의 존재유무에 따라 true, false
  const isLogin = !!memberData?.result?.userEmail;

  const [userEmail, setUserEmail] = useState("");
  const [userPw, setuserPw] = useState("");

  const onLoginFnId = (e) => setUserEmail(e.target.value);
  const onLoginFnPw = (e) => setuserPw(e.target.value);

  //이메일 형식 체크를 위한 정규식 선언
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  //로그인 처리 함수
  const onLoginFn = async () => {
    //입력값 유효성 검사
    if (!userEmail.trim() || !userPw.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    //이메일 형식에 맞지않는지 체크
    if (!emailRegex.test(userEmail.trim())) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      const resultAction = await dispatch(
        loginPostAsync({ userEmail, userPw }),
      ).unwrap();

      if (resultAction) {
        alert("로그인 성공");
        await dispatch(loadMemberInit()).unwrap();
        const from = location.state?.from || "/";

        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.");
      setuserPw("");
    }
  };
  const logoutFn = () => {
    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate("/");
  };
  return (
    <>
      <div className="login">
        <div className="login-con">
          <ul>
            {isLogin ? (
              <>
                <li>로그인상태입니다.</li>
                <button onClick={logoutFn}>로그아웃</button>
              </>
            ) : (
              <>
                <li>Login</li>
                <li>
                  <input
                    type="email"
                    name="userEmail"
                    id="userEmail"
                    placeholder="이메일을 입력해주세요"
                    value={userEmail}
                    onChange={onLoginFnId}
                  />
                </li>
                <li>
                  <input
                    type="password"
                    name="userPw"
                    id="userPw"
                    placeholder="비밀번호를 입력해주세요"
                    value={userPw}
                    onChange={onLoginFnPw}
                    onKeyDown={(e) => e.key === "Enter" && onLoginFn()} //엔터키 입력시 로그인
                  />
                </li>
                <li>
                  <button onClick={onLoginFn}>로그인</button>
                  <Link to="/auth/join">회원가입</Link>
                </li>
                <li>
                  <Link to={`${API_SERVER_URL}/oauth2/authorization/google`}>
                    <img src="" alt="구글로그인" />
                  </Link>
                  <Link to={`${API_SERVER_URL}/oauth2/authorization/naver`}>
                    <img src="" alt="네이버로그인" />
                  </Link>
                  <Link to={`${API_SERVER_URL}/oauth2/authorization/kakao`}>
                    <img src="" alt="카카오로그인" />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Login;
