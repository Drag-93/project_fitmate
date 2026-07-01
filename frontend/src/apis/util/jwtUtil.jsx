import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_URL } from "../commonApi";

const jwtAxios = axios.create();
const host = API_SERVER_URL; //백엔드 서버주소

//액세스토큰 재 발급 함수
const refreshJWT = async () => {
  const res = await axios.post(
    `${host}/reissue`,
    {},
    { withCredentials: true },
  );

  //Reissue컨트롤러가 응답 헤더로 보내주는 access토큰 추출
  const newAccessToken = res.headers["access"];
  return newAccessToken;
};

const beforeReq = (config) => {
  const memberInfo = getCookie("member");

  if (!memberInfo) {
    return Promise.reject({ response: { data: { error: "REQUIRE_LOGIN" } } });
  }

  //access 헤더에 토큰 세팅
  config.headers.access = memberInfo.access;
  return config;
};

const requestFail = (err) => Promise.reject(err);

const beforeRes = async (res) => {
  const data = res.data;

  //JwtFilter에서 걸러지는 error코드 감지시
  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    try {
      const memberCookieValue = getCookie("member");

      //새 액세스 토큰 발급
      const newAccessToken = await refreshJWT();

      //'member'쿠키 최신화
      memberCookieValue.access = newAccessToken;
      setCookie("member", JSON.stringify(memberCookieValue), 1);

      //실패했던 요청정보를 가져와서 새 토큰으로 교체
      const originalRequest = res.config;
      originalRequest.headers.access = newAccessToken;

      //새로운 토큰으로 교체 후 백그라운드 요청 재시도
      return await axios(originalRequest);
    } catch (refreshError) {
      //리프레시 토큰까지 만료 시 만료 응답 처리
      return Promise.reject(refreshError);
    }
  }

  return res;
};

const responseFail = (err) => Promise.reject(err);

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
