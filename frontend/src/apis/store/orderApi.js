import jwtAxios from "../util/jwtUtil";
import { API_SERVER_URL } from "../commonApi";


//카트 상품 주문
export const cartOrder = async (orderData) => {
  const res = await jwtAxios.post(`${API_SERVER_URL}/api/order/cart`, orderData);
  console.log(res);
  return res.data;   // orderId 반환
};

// 선택한 장바구니 상품 주문 준비
export const prepareSelectedOrder = async (cartIds) => {
  const response = await jwtAxios.post("/orders/prepare/cart", {
    cartIds,
  });

  return response.data;
};

// 장바구니 전체 주문 준비
export const prepareAllOrder = async () => {
  const response = await jwtAxios.post("/orders/prepare/cart/all");

  return response.data;
};

// 상품 바로 구매 주문 준비
export const prepareDirectOrder = async (productId, quantity) => {
  const response = await jwtAxios.post("/orders/prepare/direct", {
    productId,
    quantity,
  });

  return response.data;
};

// 실제 주문 생성
export const createOrder = async (orderRequest) => {
  const response = await jwtAxios.post("/orders", orderRequest);

  return response.data;
};