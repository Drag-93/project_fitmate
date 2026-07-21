import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const OrderPage = lazy(() => import("../../page/store/order/OrderPage"));
const OrderDetailPage = lazy(() => import("../../page/store/order/OrderDetailPage"));
const OrderListPage = lazy(() => import("../../page/store/order/OrderListPage"));
const OrderCompletePage = lazy(() => import("../../page/store/order/OrderCompletePage"));
const OrderMembershipPage = lazy(() => import("../../page/store/order/OrderMembershipPage"));

const toOrderRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <OrderPage />
        </Suspense>
      ),
    },
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <OrderListPage />
        </Suspense>
      ),
    },
    {
      path: "complete",
      element: (
        <Suspense fallback={Loading}>
          <OrderCompletePage />
        </Suspense>
      ),
    },
    {
      path: "detail/:orderId",
      element: (
        <Suspense fallback={Loading}>
          <OrderDetailPage />
        </Suspense>
      ),
    },
    {
      path: "membership",
      element: (
        <Suspense fallback={Loading}>
          <OrderMembershipPage />
        </Suspense>
      ),
    },
  ];
};

export default toOrderRouter;
