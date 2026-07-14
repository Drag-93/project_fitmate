import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const KakaoPaySuccess = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // 카카오페이가 인증 성공 후 우리 approval_url 뒤에 붙여주는 pg_token 획득
    const pgToken = searchParams.get("pg_token");
    console.log("approval 호출");
    const finalApproval = async () => {
      try {
        // 백엔드 엔드포인트와 데이터 규격 바인딩 안정화
        const response = await fetch(
          `http://localhost:8090/api/payment/approval/${paymentId}?pg_token=${pgToken}`
        );

        const result = await response.text();
        console.log("최종 결제 승인 결과 DB 반영");
        setPaymentInfo(result);
      } catch (error) {
        console.error("결제 승인 처리 중 에러 발생");
      } finally {
        setLoading(false);
      }
    };

    finalApproval();
  }, [paymentId, searchParams]);


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
                <li>주문 상품명: {paymentInfo?.productName}</li>
                <li>결제 금액: {paymentInfo?.amount?.toLocaleString()}원</li>
                <li>스마트 오더 시스템을 이용해 주셔서 감사합니다.</li>
              </>
            )}
            <li>
              <button onClick={() => navigate('/')}>HOME으로 이동</button>
            </li>
            <li>
              <button onClick={() => navigate('/payment/list')}>결제 내역 확인</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KakaoPaySuccess;