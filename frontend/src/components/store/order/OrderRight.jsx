import React from 'react';
import { kakaoPay } from "../../../apis/store/paymentApi";
import { cartOrder, directOrder } from "../../../apis/store/orderApi";

const OrderRight = ({ cartIds, orderData, totalPrice }) => {

  const handlePayment = async () => {
    try {
      let orderId;
      // 바로구매
      if (orderData.orderItemDtos?.length > 0) {
        orderId = await directOrder(orderData);
      }

      // 장바구니 구매
      else {
        orderId = await cartOrder({
          cartIds,
          order: orderData
        });
      }

      // 2. 카카오 결제 요청
      const res = await kakaoPay(orderId);
      console.log("카카오 응답:", res);

      // 3. 카카오 결제창 이동
      window.location.href = res.approvalUrl;

    } catch (e) {
      console.error("=== 결제 실패 디버깅 로그 ===");
      if (e.response) {
        // 서버가 에러 코드를 반환한 경우 (401, 403, 500 등)
        console.error("에러 상태 코드 (Status):", e.response.status);
        console.error("에러 응답 데이터 (Data):", e.response.data);
      } else if (e.request) {
        // 요청은 보냈으나 응답을 아예 받지 못한 경우
        console.error("서버로부터 응답을 받지 못함 (Network Error):", e.request);
      } else {
        // 코드 실행 중 발생한 기타 에러
        console.error("일반 에러 메시지:", e.message);
      }
    }
  };


  return (
    <div className="orderRight">

      <h2>결제 정보</h2>

      <div className="priceBox">

        <div className="priceRow">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>

        <div className="priceRow">
          <span>배송비</span>
          <span>0원</span>
        </div>

        {/* <div className="priceRow">
          <span>할인 금액</span>
          <span>-5,000원</span>
        </div> */}

        <hr />

        <div className="totalPrice">
          <span>총 결제 금액</span>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

      </div>


      <button className="paymentButton">
        결제하기
      </button>

      <button className="kakaoPayBtn" onClick={handlePayment}>
        카카오페이 결제하기
      </button>

    </div>
  );
};

export default OrderRight;