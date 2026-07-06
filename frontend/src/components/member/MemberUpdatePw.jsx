import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout, putMember } from "../../store/slices/loginSlice";
import { useDispatch } from "react-redux";

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
    // 이메일과 비밀번호를 변경하지 않았는지 체크
    if (modalPwData.userPw !== checkPwData.userPw) {
      alert("비밀번호가 서로 다릅니다. 다시 입력해주세요.");
      return;
    } else {
      dispatch(
        putMember({
          ...getData,
          userPw: modalPwData,
        }),
      );
      alert("비밀번호 변경에 성공하였습니다. 다시 로그인해주세요.");
      dispatch(logout());
      navigate("/auth/login");
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
                value={modalPwData.userPw}
                onChange={(e) => setModalPwData(e.value)}
              />
            </li>
            <li>
              <span>새 비밀번호 확인</span>
              <input
                type="password"
                value={checkPwData.userPw}
                onChange={(e) => setCheckPwData(e.value)}
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
