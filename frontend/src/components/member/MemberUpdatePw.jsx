import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/loginSlice";
import { useDispatch } from "react-redux";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

const MemberUpdatePw = () => {
  const location = useLocation();
  const getData = location.state?.getData;
  const [modalPwData, setModalPwData] = useState("");
  const [checkPwData, setCheckPwData] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 정보수정 함수
  const onEditFn = async (e) => {
    const agree = confirm("비밀번호를 수정하시겠습니까?");
    if (!agree) return;
    try {
      // 이메일과 비밀번호를 변경하지 않았는지 체크
      if (modalPwData !== checkPwData) {
        alert("비밀번호가 서로 다릅니다. 다시 입력해주세요.");
        return;
      } else {
        const formData = {
          ...getData,
          userPw: modalPwData,
        };
        const res = await jwtAxios.put(
          `${API_SERVER_URL}/api/member/update`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (res === "ok") {
          alert("회원가입 성공!");
          navigate("/auth/login");
        }
        alert("비밀번호 변경에 성공하였습니다. 다시 로그인해주세요.");
        dispatch(logout());
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("회원가입 통신 에러:", err);
      alert("서버 연결에 실패하였습니다.");
    }
  };
  return (
    <>
      <div className="memberPwModal">
        <div className="memberPwModal-con">
          <ul>
            <li>
              <span>새 비밀번호</span>
              <input
                type="password"
                value={modalPwData}
                onChange={(e) => setModalPwData(e.target.value)}
              />
            </li>
            <li>
              <span>새 비밀번호 확인</span>
              <input
                type="password"
                value={checkPwData}
                onChange={(e) => setCheckPwData(e.target.value)}
              />
            </li>
            <li>
              <span>
                <button onClick={onEditFn}>비밀번호수정</button>
              </span>
              <span>
                <button onClick={() => navigate(-1)}>뒤로가기</button>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MemberUpdatePw;
