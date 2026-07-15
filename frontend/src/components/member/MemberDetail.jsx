import React, { useEffect, useState } from "react";

import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/loginSlice";

import "../css/member/memberDetail.css";

const API_URL = API_SERVER_URL;

const MemberDetail = () => {
  //authSlice에 저장된 멤버데이터를 가져옴
  const { memberData } = useSelector((state) => state.loginSlice);

  //member의 userEmail여부로 로그인이 되었는지 확인
  const isLogin = !!memberData?.result?.userEmail;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //처음 멤버데이터를 집어넣고, 마이페이지에 보여줄 데이터
  const [member, setMember] = useState(null);

  //멤버데이터 수정 여부
  const [isUpdate, setIsUpdate] = useState(false);
  //멤버데이터를 수정할 때 따로 수정데이터를 조작할 수 있게 설정
  const [updateData, setUpdateData] = useState(null);

  //이미지 수정 시 미리보기url을 변경하기 위한 상수선언
  const [prevUrl, setPrevUrl] = useState("");

  //이메일 정규식
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  //처음 시작 시 멤버데이터를 불러오기 위한 비동기 함수
  const getMemberDetail = async () => {
    //jwtAxios => jwtUtil의 axios함수(jwt토큰 중 access토큰과 refresh토큰을 비교하여 데이터를 불러옴)
    const res = await jwtAxios.get(`${API_URL}/api/member/detail`);
    return res.data;
  };

  //멤버 수정버튼 클릭시 상태값이 서로 반전되고, 수정를 실행하는 함수
  const memberUpdateFn = () => {
    if (!isUpdate) {
      setIsUpdate((prev) => !prev);
      setUpdateData({ ...member, userPw: "" });
    } else {
      memberUpdate();
    }
  };

  //기본 데이터 onChange함수
  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };
  //파일 데이터 onChange함수
  const onChangeFileFn = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      //선택된 파일로 임시 미리보기 URL 생성 후 세팅
      setPrevUrl(URL.createObjectURL(selectedFile));
    }
  };

  //멤버수정 비동기 함수
  const memberUpdate = async () => {
    if (!confirm("회원수정을 하시겠습니까?")) return;
    try {
      //이메일 형식에 맞지않는지 체크
      if (!emailRegex.test(updateData.userEmail.trim())) {
        alert("이메일 형식이 올바르지 않습니다.");
        return;
      }
      if (!updateData.userName) {
        alert("이름을 입력해주세요");
        return;
      }

      //file정보 가져오기
      const fileInput = document.getElementById("memberFile");
      const file = fileInput?.files[0];

      const sendData = new FormData();

      Object.keys(updateData).forEach((key) => {
        // 값의 유무 체크 후 추가 (null 반환 방지)
        if (updateData[key] !== null && updateData[key] !== undefined) {
          sendData.append(key, updateData[key]);
        }
      });
      //파일이 존재할때만 FormData에 memberFile이름으로 추가
      if (file) {
        sendData.append("memberFile", file);
      }

      const res = await jwtAxios.put(`${API_URL}/api/member/update`, sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(res);
      if (res.status === 200) {
        try {
          const newData = await getMemberDetail();
          if (newData && newData.result) {
            setMember(newData.result);
          }
        } catch (err) {
          console.error("최신 회원 정보 가져오기 실패:", err);
        }
        if (updateData.userEmail !== member.userEmail) {
          dispatch(logout());
          alert("이메일 변경확인. 다시 로그인 해주시기 바랍니다.");
          navigate("/auth/login");
        } else {
          alert("회원수정에 성공하였습니다.");
          setIsUpdate((prev) => !prev);
        }
      } else {
        alert("회원수정 실패");
      }
    } catch (err) {
      console.log(err);
      alert("회원수정중 오류가 발생했습니다.");
    }
  };

  //멤버 삭제 비동기 함수
  const memberDelete = async () => {
    if (!confirm("회원탈퇴를 하시겠습니까?")) return;
    try {
      const res = await jwtAxios.delete(`${API_URL}/api/member/quit`);
      if (res.data === "ok") {
        dispatch(logout());
        alert("회원탈퇴 성공");
        window.location.href = "/";
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
        .then((data) => {
          setMember(data.result);
          console.log(data);
        })
        .catch((err) => console.error(err));
    }
  }, [isLogin]);
  return (
    <>
      <div className="memberDetail">
        <div className="memberDetail-con">
          <div className="memberInfo">
            <ul
              className={
                isUpdate ? "memberForm updateMode" : "memberForm viewMode"
              }
            >
              {member === null ? (
                <>회원님의 정보를 불러오는 중입니다...</>
              ) : !isUpdate ? (
                <>
                  <li className="memberTitle">
                    <h1>{member.userName}님</h1>
                  </li>
                  <li className="profilePhoto">
                    <span>프로필사진</span>
                    <span>
                      {member && member.newFileName ? (
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
                    <span>이메일</span>
                    <span>{member.userEmail}</span>
                  </li>
                  <li>
                    <span>주소</span>
                    <span>{member.userAddress || ""}</span>
                  </li>
                  <li>
                    <span>전화번호</span>
                    <span>{member.userPhone || ""}</span>
                  </li>
                  <li>
                    <span>구독여부</span>
                    <span>{member.subscribe}</span>
                  </li>
                  <li>
                    <span><Link to="/order/list">주문/결제</Link></span>
                  </li>
                  <li>
                    <span><Link to="/mypage/">구독 관리</Link></span>
                  </li>
                  <li>
                  <span><Link to="/mypage/">운동 관리</Link></span>
                  </li>
                  <li className="buttonArea">
                    <button
                      className="pwBtn"
                      onClick={() =>
                        navigate("/mypage/updatepw", {
                          state: { getData: member },
                        })
                      }
                    >
                      비밀번호변경
                    </button>
                    <button className="updateBtn" onClick={memberUpdateFn}>
                      개인정보수정
                    </button>
                    <button className="deleteBtn" onClick={memberDelete}>
                      회원탈퇴
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="profilePhoto">
                    <span>프로필사진</span>
                    <span className="profile-preview">
                      {prevUrl ? (
                        // 유저가 방금 새로운 파일을 선택한 경우(이미지 미리보기)
                        <img
                          src={prevUrl}
                          alt="새 이미지 미리보기"
                          className="prev-img"
                        />
                      ) : member && member.newFileName ? (
                        //파일을 아직 고르지 않았을때 & 기존에 저장된 이미지가 있을경우(기존 이미지)
                        <img
                          src={`${API_URL}/upload/member/${member.newFileName}`}
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
                    <span>
                      <input
                        type="file"
                        name="memberFile"
                        id="memberFile"
                        onChange={onChangeFileFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>유저명</span>
                    <span>
                      <input
                        type="text"
                        value={updateData.userName}
                        id="userName"
                        name="userName"
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>이메일</span>
                    <span>
                      <input
                        type="email"
                        value={updateData.userEmail}
                        id="userEmail"
                        name="userEmail"
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>주소</span>
                    <span>
                      <input
                        type="text"
                        value={updateData.userAddress || ""}
                        id="userAddress"
                        name="userAddress"
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li>
                    <span>전화번호</span>
                    <span>
                      <input
                        type="text"
                        value={updateData.userPhone || ""}
                        id="userPhone"
                        name="userPhone"
                        onChange={onChangeFn}
                      />
                    </span>
                  </li>
                  <li className="buttonArea">
                    <span>
                      <button className="saveBtn" onClick={memberUpdateFn}>
                        개인정보수정
                      </button>
                    </span>
                    <span>
                      <button
                        className="cancelBtn"
                        onClick={() => {
                          setIsUpdate((prev) => !prev);
                          setPrevUrl("");
                        }}
                      >
                        취소
                      </button>
                    </span>
                    <span>
                      <button onClick={memberDelete} className="deleteBtn">
                        회원탈퇴
                      </button>
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
