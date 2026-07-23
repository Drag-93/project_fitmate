import { useEffect, useState } from "react";
import jwtAxios from "../../../apis/util/jwtUtil";
import "../../css/store/subscription/MySubscription.css";
import { useNavigate } from "react-router-dom";

const MySubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSubscriptionList();
  }, []);

  const getSubscriptionList = async () => {
    try {
      const res = await jwtAxios.get("/api/subscription/list");
      console.log("구독 목록:", res.data);
      setSubscriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------------
  // 가장 최신의 ACTIVE 또는 CANCELED 구독 찾기
  // ----------------------------------------------------
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.productType === "PREMIUM" && sub.subscriptionStatus === "ACTIVE"
  );

  // 여러 개의 ACTIVE 구독이 있다면 ID가 가장 큰(최신) 항목 선택
  const premiumSubscription = activeSubscriptions.length > 0
    ? activeSubscriptions.reduce((latest, current) => (current.id > latest.id ? current : latest))
    : null;

  // 구독해지 함수
  const cancelSubscription = async () => {
    if (!premiumSubscription || !premiumSubscription.id) {
      alert("해지할 구독 정보를 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm(`[${premiumSubscription.productName}] 구독을 해지하시겠습니까?`)) {
      return;
    }

    try {
      // PUT /api/subscription/{subscriptionId}/cancel
      await jwtAxios.put(`/api/subscription/${premiumSubscription.id}/cancel`);

      alert("구독이 해지되었습니다.");

      // 상태 재조회
      getSubscriptionList();
    } catch (err) {
      console.error("구독 해지 에러:", err);
      alert(err.response?.data?.message || "구독 해지 실패");
    }
  };

  if (loading) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div className="my-subscription-page">
      <h2>FitMate Plus+</h2>

      {premiumSubscription ? (
        <>
          <div className="subscription-info">
            <h3>현재 이용 중</h3>

            <p>
              <strong>상품명</strong>&nbsp;
              <span>{premiumSubscription.productName}</span>
            </p>

            <p>
              <strong>구독 시작일</strong>&nbsp;
              <span>{premiumSubscription.startDate?.split("T")[0]}</span>
            </p>

            <p>
              <strong>다음 결제일</strong>&nbsp;
              <span>{premiumSubscription.nextPaymentDate?.split("T")[0]}</span>
            </p>

            <p>
              <strong>상태</strong>&nbsp;
              <span>{premiumSubscription.subscriptionStatus}</span>
            </p>
          </div>

          <div className="benefit-box">
            <h3>받고 있는 혜택</h3>

            <ul>
                <li>✔ PT 상품 할인</li>
                <li>✔ 헬스장 이용권 할인</li>
                <li>✔ 굿즈 할인</li>
                <li>✔ 무조건 무료배송</li>
                <li>✔ PT 우선 예약 서비스</li>
            </ul>
          </div>
          <button
            className="payment-history-btn"
            onClick={() => setShowPaymentModal(true)}
          >
            결제 내역 보기
          </button>
          <button
            className="cancel-btn"
            onClick={cancelSubscription}
          >
            구독 해지
          </button>
        </>
      ) : (
        <>
          <div className="premium-guide">
            <h3>아직 FitMate Plus+를 이용하고 있지 않습니다.</h3>

            <p>
              지금 구독하고 다양한 프리미엄 혜택을 받아보세요.
            </p>

            <div className="benefit-box">
              <h3>구독 혜택</h3>

              <ul>
                <li>✔ PT 상품 할인</li>
                <li>✔ 헬스장 이용권 할인</li>
                <li>✔ 굿즈 할인</li>
                <li>✔ 무조건 무료배송</li>
                <li>✔ PT 우선 예약 서비스</li>
              </ul>
            </div>

            <button className="subscribe-btn" onClick={() => navigate("/subscription/premium")}>
              FitMate Plus+ 구독하기
            </button >
          </div>
        </>
      )}

      {/* 결제내역 모달 (메인 return 문 내부로 이동) */}
      {showPaymentModal && (
        <div className="modal-bg">
          <div className="payment-modal">
            <h3>구독 결제 상세</h3>
            <p>
              <strong>결제일</strong>
              <span>
                {premiumSubscription?.createTime
                  ? premiumSubscription.createTime.split("T")[0]
                  : "-"}
              </span>
            </p>
            <p>
              <strong>결제 수단</strong>
              <span>카카오페이</span>
            </p>
            <p>
              <strong>결제 상태</strong>
              <span>결제 완료</span>
            </p>
            <button onClick={() => setShowPaymentModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscription;