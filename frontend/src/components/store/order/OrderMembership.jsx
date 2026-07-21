import CommonCalendar from "../../common/calendar/CommonCalendar";
import { kakaoPay } from "../../../apis/store/paymentApi";
import { createMembershipOrder } from "../../../apis/store/orderApi";
import { useState } from "react";

const OrderMembership = ({ product }) => {

  const [startDate, setStartDate] = useState(null);

  const handleDateClick = (info) => {
    setStartDate(info.dateStr);
  };

  const handlePayment = async () => {

    if (!startDate) {
      alert("이용 시작일을 선택해주세요.");
      return;
    }

    try {
      const orderId = await createMembershipOrder({
        productId: product.id,
        startDate
      });

      if (!orderId) {
        alert("주문 생성 실패");
        return;
      }

      const payment = await kakaoPay(orderId);
      console.log("카카오 응답:", payment);
      window.location.href = payment.approvalUrl;
    } catch (e) {
      console.log(e);
    }
  };

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  return (

    <div className="order-membership">
      <div className="order-membership-con">

        <h2>결제하기</h2>

        <div className="calendar-box">

          <CommonCalendar
            events={[]}
            onDateClick={handleDateClick}
            validRange={{
              start: new Date(),
            }}
          />
        </div>

        <div className="selected-date">
          이용 시작일 : &nbsp;
          {startDate || " 선택해주세요."}
        </div>


        <div className="order-product">
          <h3>{product.productName}</h3>

          <p>상품 종류 : {product.productType}</p>

          {product.duration > 0 && (
            <p>이용기간 : {product.duration}일</p>
          )}

          {product.sessionCount > 0 && (
            <p>PT 횟수 : {product.sessionCount}회</p>
          )}

          <p>
            결제금액 : {product.price.toLocaleString()}원
          </p>
        </div>

        <hr />

        <div className="order-payment">
          <button onClick={handlePayment}>
            카카오페이 결제
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderMembership;