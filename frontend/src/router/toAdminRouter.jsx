import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div className="loading">...Loading</div>;

const AdminIndexPage = lazy(() => import("../page/admin/AdminIndexPage"));
const AdminCalendarPage = lazy(() => import("../page/admin/AdminCalendarPage"));
const AdminPopupPage = lazy(() => import("../page/admin/AdminPopupPage"));
const AdminMemberPage = lazy(() => import("../page/admin/AdminMemberPage"));
const AdminMemberDetailPage = lazy(
  () => import("../page/admin/AdminMemberDetailPage"),
);

const AdminProductListPage = lazy(() => import("../page/store/product/admin/AdminProductListPage"));
const AdminProductUpdatePage = lazy(() => import("../page/store/product/admin/AdminProductUpdatePage"));
const AdminProductInsertPage = lazy(() => import("../page/store/product/admin/AdminProductInsertPage"));
const AdminProductDetailPage = lazy(() => import("../page/store/product/admin/AdminProductDetailPage"));

const toAdminRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"index"} />,
    },
    {
      path: "index",
      element: (
        <Suspense fallback={Loading}>
          <AdminIndexPage />
        </Suspense>
      ),
    },
    {
      path: "calendar",
      element: (
        <Suspense fallback={Loading}>
          <AdminCalendarPage />
        </Suspense>
      ),
    },
    {
      path: "index",
      element: (
        <Suspense fallback={Loading}>
          <AdminIndexPage />
        </Suspense>
      ),
    },
    {
      path: "index",
      element: (
        <Suspense fallback={Loading}>
          <AdminIndexPage />
        </Suspense>
      ),
    },
    {
      path: "popup",
      element: (
        <Suspense fallback={Loading}>
          <AdminPopupPage />
        </Suspense>
      ),
    },
    //관리자 멤버 페이지
    {
      path: "member",
      element: (
        <Suspense fallback={Loading}>
          <AdminMemberPage />
        </Suspense>
      ),
    },
    //관리자 멤버 상세페이지(member의 자식이 아닌 새로운 페이지로)
    {
      path: "member/detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <AdminMemberDetailPage />
        </Suspense>
      ),
    },
    {
      path: "product",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductListPage />
        </Suspense>
      ),
    },
    {
      path: "order",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductListPage />
        </Suspense>
      ),
    },
    {
      path: "product/update/:productId",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductUpdatePage />
        </Suspense>
      ),
    },
    {
      path: "product/insert",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductInsertPage />
        </Suspense>),
    },
    {
      path: "product/detail/:productId",
      element: (
        <Suspense fallback={Loading}>
          <AdminProductDetailPage />
        </Suspense>),
    },
  ];
};

export default toAdminRouter;
