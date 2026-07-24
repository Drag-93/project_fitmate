import React, { lazy, Suspense } from "react";

const Loading = <div className="loading">...Loading</div>;

const MemberDetailPage = lazy(() => import("../page/member/MemberDetailPage"));
const MemberUpdatePwPage = lazy(
  () => import("../page/member/MemberUpdatePwPage"),
);
const MySchedulePage = lazy(() => import("../page/member/MySchedulePage"));
const OrderListPage = lazy(() => import("../page/store/order/OrderListPage"));
const MySubscriptionPage = lazy(() => import("../page/store/subscription/MysubscriptionPage"));
const ReservationPage = lazy(() => import("../page/store/reservation/ReservationPage"));
const MembershipPage = lazy(() => import("../page/store/subscription/MembershipPage"));

const toMemberRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <MemberDetailPage />
        </Suspense>
      ),
    },
    {
      path: "updatepw",
      element: (
        <Suspense fallback={Loading}>
          <MemberUpdatePwPage />
        </Suspense>
      ),
    },
    {
      path: "schedule",
      element: (
        <Suspense fallback={Loading}>
          <MySchedulePage />
        </Suspense>
      ),
    },
    {
      path: "subscription",
      element: (
        <Suspense fallback={Loading}>
          <MySubscriptionPage />
        </Suspense>
      ),
    },
    {
      path: "orderList",
      element: (
        <Suspense fallback={Loading}>
          <OrderListPage />
        </Suspense>
      ),
    },
    {
      path: "pt",
      element: (
        <Suspense fallback={Loading}>
          <ReservationPage />
        </Suspense>
      ),
    },
    {
      path: "memberships",
      element: (
        <Suspense fallback={Loading}>
          <MembershipPage />
        </Suspense>
      ),
    },
  ];
};

export default toMemberRouter;
