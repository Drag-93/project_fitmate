import jwtAxios from "axios"; // 나중에 util로 수정
import { API_SERVER_URL } from "../commonApi";

export const kakaoPay = async (orderId) => {
  const res = await jwtAxios.get(`${API_SERVER_URL}/api/payment/kakao/pg/${orderId}`);
  return res.data;
};