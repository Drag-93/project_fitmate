import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const KakaoPaySuccess = () => {
  const navigate = useNavigate();
  const payData = useParams(); // URL 경로 변수 {paymentId, productPrice, productName, memberId}
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 카카오페이가 인증 성공 후 우리 approval_url 뒤에 붙여주는 pg_token 획득
    const pgToken = searchParams.get("pg_token");

    const finalApproval = async () => {
      try {
        // 백엔드 엔드포인트와 데이터 규격 바인딩 안정화
        const response = await fetch("http://localhost:8095/payment/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentId: payData.paymentId,
            productPrice: payData.productPrice,
            productName: payData.productName,
            memberId: payData.memberId,
            pgToken: pgToken // 파라미터로 받은 토큰도 함께 전송 가능하도록 구성
          })
        });

        const result = await response.json();
        console.log("최종 결제 승인 결과 DB 반영:", result);
      } catch (error) {
        console.error("결제 승인 처리 중 에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    finalApproval();
  }, [payData, searchParams]);

  return (
    <div className="kakaoPay-success">
      <div className="kakaoPay-success-con">
        <div className="title">결제 완료 및 승인 성공</div>
        <div className="kakaoPay-result">
          <ul>
            {loading ? (
              <li>결제 승인을 처리하고 있습니다. 잠시만 기다려주세요...</li>
            ) : (
              <>
                <li>고객님이 주문하신 상품의 결제가 정상 완료되었습니다.</li>
                <li>주문 상품명: {decodeURIComponent(payData.productName)}</li>
                <li>결제 금액: {Number(payData.productPrice).toLocaleString()}원</li>
                <li>스마트 오더 시스템을 이용해 주셔서 감사합니다.</li>
              </>
            )}
            <li>
              <button onClick={() => navigate('/')}>HOME으로 이동</button>
            </li>
            <li>
              <button onClick={() => navigate('/react/kakaoPay/list')}>결제 내역 확인</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KakaoPaySuccess;