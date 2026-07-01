import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie, removeCookie } from "../../apis/util/cookieUtil";
import { loginFn } from "../../apis/member/login";
const initState = {
  userEmail: "",
};
export const loginPostAsync = createAsyncThunk(
  "loginPostAsync",
  ({ userEmail, userPw }) => {
    return loginFn(userEmail, userPw);
  },
);

const loadMemberCookie = () => {
  const memberInfo = getCookie("member");

  if (memberInfo && memberInfo.userEmail) {
    memberInfo.userEmail = decodeURIComponent(memberInfo.userEmail);
  }
  if (memberInfo !== null) return memberInfo;
  if (memberInfo === null) return null;
};

//로그인 관련 슬라이스 설정
const loginSlice = createSlice({
  name: "loginSlice",
  initialState: loadMemberCookie() || initState, //쿠키의 유무에따라 초깃값사용
  reducers: {
    //로그인
    login: (state, action) => {
      const payload = action.payload;
      setCookie("member", JSON.stringify(payload), 1);
      return payload;
    },
    //로그아웃
    logout: (state, action) => {
      removeCookie("member"); //쿠키삭제
      return { ...initState }; //초기상태로
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        const payload = action.payload;

        //정상적인 로그인 확인
        if (payload && !payload.error) {
          const cookiePayload = { ...payload };

          //이메일의 한글 처리(필요한지는 모르겠음)
          if (cookiePayload.userEmail) {
            cookiePayload.userEmail = encodeURIComponent(
              cookiePayload.userEmail,
            );
          }

          //쿠키 저장
          setCookie("member", JSON.stringify(cookiePayload), 1);
        }

        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {
        console.log("pending");
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected");
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice;
