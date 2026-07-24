import React, { useEffect, useState } from "react";
import jwtAxios from "../../../../apis/util/jwtUtil";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER_URL } from "../../../../apis/commonApi";
import "../../../../css/admin/AdminMemberDetail.css";
import { checkEmail, memberUpdate } from "../../../../apis/member/memberApi";
const AdminMemberViewDetail = () => {
  //파라미터로 받는 id값
  const { id } = useParams();

  const navigate = useNavigate();

  //원본memberData(pw저장&이메일비교용)
  const [originMemberData, setOriginMemberData] = useState(null);
  //기본 memberData
  const [memberData, setMemberData] = useState(null);
  //pw변경용 저장데이터
  const [memberPw, setMemberPw] = useState("");
  //이미지 수정 시 미리보기url을 변경데이터
  const [prevUrl, setPrevUrl] = useState("");
  //이메일 정규식
  const emailRegex =
    /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  //멤버 데이터 onchange함수
  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };
  //파일 데이터 onChange함수
  const onChangeFileFn = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      //선택된 파일로 임시 미리보기 URL 생성 후 세팅
      setPrevUrl(URL.createObjectURL(selectedFile));
    }
  };

  //url의 파라미터에 저장된 id로 회원 상세정보 조회
  const getMemberList = async () => {
    const url = `${API_SERVER_URL}/api/member/detail/${id}`;
    try {
      const res = await jwtAxios.get(url);
      setMemberData(res.data.result);
      setOriginMemberData(res.data.result);
      // console.log(res.data);
    } catch (err) {
      alert("에러발생 : " + err);
    }
  };

  //pw만 변경&저장하는 함수
  const onUpdatePwFn = async (e) => {
    if (memberPw === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    const agree = confirm("비밀번호를 수정하시겠습니까?");
    if (!agree) return;
    try {
      const formData = {
        ...originMemberData,
        userPw: memberPw,
      };
      const res = await jwtAxios.put(
        `${API_SERVER_URL}/api/member/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data === "ok") {
        alert("비밀번호 변경에 성공하였습니다.");
        setMemberPw("");
      } else {
        alert("비밀번호 변경에 실패하였습니다. 다시입력해주세요.");
      }
    } catch (err) {
      console.error("서버통신 에러:", err);
    }
  };

  //pw제외 회원정보 수정
  const updateFn = async () => {
    //처음 렌더링 시 데이터가 없을때 호출되면 함수종료
    if (!memberData || !originMemberData) return;
    //이메일 변경감지를 위해 원본데이터와 바꾼데이터를 비교
    const emailChanged = memberData.userEmail !== originMemberData.userEmail;
    //만약 기존 이메일의 변경이 있었다면 이메일중복체크
    if (emailChanged) {
      const emailCheckResult = await checkEmail(
        memberData.userEmail,
        emailRegex,
      );
      if (emailCheckResult) {
        alert("이메일이 중복되었습니다.");
        return;
      }
    }

    //이메일 변경 함수 실행
    memberUpdate({
      memberData: memberData,
      navigate,
      redirectUrl: "/admin/member", // 성공 시 바로 이동할 주소 주입
      apiUrl: API_SERVER_URL,
    });
  };

  //회원 삭제 함수
  const deleteFn = async () => {
    const agree = confirm("회원을 삭제하시겠습니까?");
    if (!agree) return;
    try {
      const res = await jwtAxios.delete(
        `${API_SERVER_URL}/api/member/delete/${memberData.id}`,
      );
      if (res.data === "ok") {
        alert("회원삭제에 성공하였습니다.");
        navigate("/admin/member");
      } else {
        alert("회원삭제에 실패하였습니다. 서버를 확인해주세요.");
      }
    } catch (err) {
      console.error("서버통신 에러:", err);
    }
  };
  useEffect(() => {
    getMemberList();
  }, []);

  return (
    memberData !== null && (
      <>
        <div className="memberDetail-con">
          <ul>
            <li>
              <h1>회원데이터</h1>
            </li>
            <li>
              <span>고유번호</span>
              <span>{memberData.id}</span>
            </li>
            <li>
              <span>이름</span>
              <span>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  value={memberData.userName}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>이메일</span>
              <span>
                <input
                  type="email"
                  name="userEmail"
                  id="userEmail"
                  value={memberData.userEmail}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>비밀번호</span>
              <span>
                <input
                  type="password"
                  name="userPw"
                  id="userPw"
                  value={memberPw}
                  onChange={(e) => setMemberPw(e.target.value)}
                />
                <button onClick={onUpdatePwFn}>비밀번호 변경</button>
              </span>
            </li>
            <li>
              <span>주소</span>
              <span>
                <input
                  type="text"
                  name="userAddress"
                  id="userAddress"
                  value={memberData.userAddress || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>전화번호</span>
              <span>
                <input
                  type="text"
                  name="userPhone"
                  id="userPhone"
                  value={memberData.userPhone || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>권한</span>
              <span>
                <select
                  name="role"
                  id="role"
                  value={memberData.role}
                  onChange={onChangeFn}
                >
                  <option value="ADMIN">관리자</option>
                  <option value="TRAINER">트레이너</option>
                  <option value="MANAGER">매니저</option>
                  <option value="MEMBER">일반회원</option>
                </select>
              </span>
            </li>
            <li>
              <span>구독여부</span>
              <span>
                <input
                  type="text"
                  name="subscribe"
                  id="subscribe"
                  value={memberData.subscribe}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>프로필사진</span>
              <span className="profile-preview">
                {prevUrl ? (
                  // 유저가 방금 새로운 파일을 선택한 경우(이미지 미리보기)
                  <img
                    src={prevUrl}
                    alt="새 이미지 미리보기"
                    className="prev-img"
                  />
                ) : memberData && memberData.newFileName ? (
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
              <span>
                <input
                  type="file"
                  name="memberFile"
                  id="memberFile"
                  onChange={onChangeFileFn}
                />
              </span>
            </li>
          </ul>
          <ul>
            <li>
              <h1>추가데이터</h1>
            </li>
            <li>
              <span>관심사</span>
              <span>
                <select
                  name="interest"
                  id="interest"
                  value={memberData.interest || ""}
                  onChange={onChangeFn}
                >
                  <option value="">없음</option>
                  <option value="DIET">다이어트</option>
                  <option value="WORKOUT">운동</option>
                  <option value="HEALTH">건강관리</option>
                </select>
              </span>
            </li>
            <li>
              <span>키</span>
              <span>
                <input
                  type="number"
                  step="0.1"
                  name="height"
                  id="height"
                  value={memberData.height || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>몸무게</span>
              <span>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  id="weight"
                  value={memberData.weight || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>목표몸무게</span>
              <span>
                <input
                  type="number"
                  step="0.01"
                  name="goalWeight"
                  id="goalWeight"
                  value={memberData.goalWeight || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>출석체크</span>
              <span>
                <input
                  type="number"
                  name="dailyCheck"
                  id="dailyCheck"
                  value={memberData.dailyCheck || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
            <li>
              <span>뱃지</span>
              <span>
                <input
                  type="text"
                  name="badge"
                  id="badge"
                  value={memberData.badge || ""}
                  onChange={onChangeFn}
                />
              </span>
            </li>
          </ul>
          <ul className="buttons">
            <li>
              <button onClick={updateFn}>수정</button>
              <button onClick={deleteFn}>삭제</button>
              <button onClick={() => navigate("/admin/member")}>
                뒤로가기
              </button>
            </li>
          </ul>
        </div>
      </>
    )
  );
};

export default AdminMemberViewDetail;
