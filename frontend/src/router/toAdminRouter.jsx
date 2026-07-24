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
const TabInsertPage = lazy(() => import("../page/community/TabInsertPage"));
const TabDetailPage = lazy(() => import("../page/community/TabDetailPage"));

const AdminProductListPage = lazy(
  () => import("../page/shop/product/admin/AdminProductListPage"),
);
const AdminProductUpdatePage = lazy(
  () => import("../page/shop/product/admin/AdminProductUpdatePage"),
);
const AdminProductInsertPage = lazy(
  () => import("../page/shop/product/admin/AdminProductInsertPage"),
);
const AdminOrderListPage = lazy(
  () => import("../page/shop/order/admin/AdminOrderListPage"),
);
const AdminCommunityPage = lazy(
  () => import("../page/admin/AdminCommunityPage"),
);
const AdminChatBotPage = lazy(() => import("../page/admin/AdminChatBotPage"));
const AdminChatBotDetailPage = lazy(
  () => import("../page/admin/AdminChatBotDetailPage"),
);
const AdminCommunityDetailPage = lazy(
  () => import("../page/admin/AdminCommunityDetailPage"),
);
const AdminNoticeWritePage = lazy(
  () => import("../page/admin/AdminNoticeWritePage"),
);
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
          <AdminOrderListPage />
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
        </Suspense>
      ),
    },
    {
      path: "community",
      element: (
        <Suspense fallback={Loading}>
          <AdminCommunityPage />
        </Suspense>
      ),
    },
    {
      path: "tabInsert",
      element: (
        <Suspense fallback={Loading}>
          <TabInsertPage />
        </Suspense>
      ),
    },
    {
      path: "tabDetail/:id",
      element: (
        <Suspense fallback={Loading}>
          <TabDetailPage />
        </Suspense>
      ),
    },
    //챗봇의 Chat, Answer CRUD를 담당하는 Page
    {
      path: "chatbot",
      element: (
        <Suspense fallback={Loading}>
          <AdminChatBotPage />
        </Suspense>
      ),
    },
    {
      path: "chatbot/detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <AdminChatBotDetailPage />
        </Suspense>
      ),
    },
    {
      path: "comumnity/detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <AdminCommunityDetailPage />
        </Suspense>
      ),
    },
    {
      path: "comumnity/insert",
      element: (
        <Suspense fallback={Loading}>
          <AdminNoticeWritePage />
        </Suspense>
      ),
    },
  ];
};

export default toAdminRouter;
