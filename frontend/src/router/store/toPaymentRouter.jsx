import React, { lazy, Suspense } from "react";

const Loading = <div className="loading">...Loading</div>;

const PaymentSuccessPage = lazy(() => import("../../page/store/payment/PaymentSuccessPage"));
const PaymentPage = lazy(() => import("../../page/store/payment/PaymentPage"));
const PaymentFailPage = lazy(() => import("../../page/store/payment/PaymentFailPage"));
const PaymentListPage = lazy(() => import("../../page/store/payment/PaymentListPage"));
const KakaoPayApproval = lazy(() => import("../../components/store/payment/KakaoPayApproval"));


const toPaymentRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <PaymentPage />
        </Suspense>
      ),
    },
    {
      path: "fail",
      element: (
        <Suspense fallback={Loading}>
          <PaymentFailPage />
        </Suspense>
      ),
    },
    {
      // 카카오 결제 승인 처리
      path: "approval/:paymentId",
      element: (
        <Suspense fallback={Loading}>
          <KakaoPayApproval />
        </Suspense>
      ),
    },
    // 모든 결제 완료 화면
    {
      path: "success",
      element: (
        <Suspense fallback={Loading}>
          <PaymentSuccessPage />
        </Suspense>
      ),
    },
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <PaymentListPage />
        </Suspense>
      ),
    },
  ];
};

export default toPaymentRouter;
