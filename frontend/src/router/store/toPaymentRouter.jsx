import React, { lazy, Suspense } from "react";

const Loading = <div className="loading">...Loading</div>;

const KakaoPaySuccessPage = lazy(() => import("../../page/store/payment/KakaoPaySuccessPage"));
const PaymentPage = lazy(() => import("../../page/store/payment/PaymentPage"));
const PaymentFailPage = lazy(
  () => import("../../page/store/payment/PaymentFailPage"),
);
const PaymentSuccessPage = lazy(
  () => import("../../page/store/payment/PaymentSuccessPage"),
);

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
      path: "success",
      element: (
        <Suspense fallback={Loading}>
          <PaymentSuccessPage />
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
      path: "/payment/approval/:paymentId",
      element: (
        <Suspense fallback={Loading}>
          <KakaoPaySuccessPage />
        </Suspense>
      ),
      
    },
  ];
};

export default toPaymentRouter;
