import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div className="loading">...Loading</div>;

const AdminIndexPage = lazy(() => import("../page/admin/AdminIndexPage"));
const AdminCalendarPage = lazy(() => import("../page/admin/AdminCalendarPage"));
const AdminPopupPage = lazy(() => import("../page/admin/AdminPopupPage"));
const AdminMemberPage = lazy(() => import("../page/admin/AdminMemberPage"));

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
    {
      path: "member",
      element: (
        <Suspense fallback={Loading}>
          <AdminMemberPage />
        </Suspense>
      ),
    },
  ];
};

export default toAdminRouter;
