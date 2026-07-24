import CommonCalendar from "../../common/calendar/CommonCalendar";
import { kakaoPay, normalPayment } from "../../../apis/shop/paymentApi";
import { createMembershipOrder } from "../../../apis/shop/orderApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethod from "../order/PaymentMethod";

const OrderMembership = ({ product }) => {

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [agree, setAgree] = useState(false);
  const [payment, setPayment] = useState("kakao");

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  const handleDateClick = (info) => {
    setStartDate(info.dateStr);
  };

  const handlePayment = async () => {

    if (!startDate) {
      alert("이용 시작일을 선택해주세요.");
      return;
    }
    // PREMIUM만 자동결제 동의 체크
    if (product.productType === "PREMIUM" && !agree) {
      alert("자동결제 및 이용약관에 동의해주세요.");
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

      // 카카오페이
      if (payment === "kakao") {
        const res = await kakaoPay(orderId);
        window.location.href = res.approvalUrl;
        return;
      }

      // 일반결제
      if (payment === "card") {
        const result = await normalPayment(orderId);
        alert("결제가 완료되었습니다.");
        navigate("/payment/success", {
          state: result
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  // 이용 종료일 / 다음 결제일 계산
  const getEndDate = () => {
    if (!startDate || !product.duration) return "";

    const date = new Date(startDate);
    date.setDate(date.getDate() + product.duration);

    return date.toISOString().split("T")[0];
  };

  // PREMIUM 다음 결제일
  const getNextPaymentDate = () => {
    if (!startDate) return "";
    const date = new Date(startDate);
    const currentDay = date.getDate();
    date.setMonth(date.getMonth() + 1);
    // 월을 더했을 때 일수가 달라진 경우 (예: 1/31 -> 2월말) 조정
    if (date.getDate() !== currentDay) {
      date.setDate(0);
    }
    return date.toISOString().split("T")[0];
  };
  // 오늘 날짜 (00:00:00 기준)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (

    <div className="order-membership">
      <div className="order-membership-con">

        <h2>결제하기</h2>

        <div className="calendar-box">

          <CommonCalendar
            events={[]}
            onDateClick={handleDateClick}
            validRange={{
              start: today, //시간 차이 문제 방지
            }}
          />
        </div>

        <div className="selected-date">
          이용 시작일 : &nbsp;
          {startDate || " 선택해주세요."}

          {/* GYM 이용 종료일 */}
          {product.productType === "GYM" && (
            <p>
              이용 종료일 : &nbsp;
              {startDate && product.duration
                ? getEndDate()
                : "-"}
            </p>
          )}

          {/* PREMIUM 다음 결제일 */}
          {product.productType === "PREMIUM" && (
            <p>
              다음 결제일 : &nbsp;
              {startDate ? getNextPaymentDate() : "-"}
            </p>
          )}
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
        <PaymentMethod
          payment={payment}
          setPayment={setPayment}
        />
        <hr />
        {product.productType === "PREMIUM" && (
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            자동결제 및 이용약관 동의
          </label>
        )}
        <div className="order-payment">
          <button onClick={handlePayment}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderMembership;