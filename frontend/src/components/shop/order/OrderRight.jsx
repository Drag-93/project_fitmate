import React from 'react';
import { kakaoPay, normalPayment } from "../../../apis/shop/paymentApi";
import { cartOrder, directOrder } from "../../../apis/shop/orderApi";
import { useNavigate } from 'react-router-dom';

const OrderRight = ({ cartIds, orderData, totalPrice, payment }) => {
  const navigate = useNavigate();
  
  // 주문생성
  const createOrder = async () => {
    let orderId;
    //바로 구매
    if (orderData.orderItemDtos?.length > 0) {
      orderId = await directOrder(orderData);
    } else {
      // 장바구니 구매
      orderId = await cartOrder({
        cartIds,
        order: orderData
      });
    }
    return orderId;
  };
  // 결제
  const handlePayment = async () => {
    try {
      const orderId = await createOrder();
      // 카카오페이
      if (payment === "kakao") {
        const res = await kakaoPay(orderId);
        window.location.href = res.approvalUrl;
        return;
      }
      // 일반결제
      if (payment === "card") {
        const paymentResult = {
          orderId,
          paymentStatus: "SUCCESS",
          paymentMethod:
            payment.toUpperCase(),
          amount: totalPrice
        };
        alert("결제가 완료되었습니다.");
        const result = await normalPayment(orderId);
        navigate("/payment/success", {
          state: result
        });
      }
    } catch (e) {
      console.error("결제 실패:", e);
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


      <button className="paymentButton" onClick={handlePayment}>
        결제하기
      </button>

    </div>
  );
};

export default OrderRight;