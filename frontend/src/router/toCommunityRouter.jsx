import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div className="loading">...Loading</div>;

const CommunityIndexPage = lazy(
  () => import("../page/community/CommunityIndexPage"),
);
const CommunityInsertPage = lazy(
  () => import("../page/community/CommunityInsertPage"),
);
const CommunityListPage = lazy(
  () => import("../page/community/CommunityListPage"),
);
const CommunityDetailPage = lazy(
  () => import("../page/community/CommunityDetailPage"),
);
const CommunityUpdatePage = lazy(
  () => import("../page/community/CommunityUpdatePage"),
);
const TabInsertPage = lazy(() => import("../page/community/TabInsertPage"));
const TabListPage = lazy(() => import("../page/community/TabListPage"));
const TabDetailPage = lazy(() => import("../page/community/TabDetailPage"));

const toCommunityRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"index"} />,
    },
    {
      path: "index",
      element: (
        <Suspense fallback={Loading}>
          <CommunityIndexPage />
        </Suspense>
      ),
    },
    {
      path: "insert",
      element: (
        <Suspense fallback={Loading}>
          <CommunityInsertPage />
        </Suspense>
      ),
    },
    {
      path: "detail/:id",
      element: (
        <Suspense fallback={Loading}>
          <CommunityDetailPage />
        </Suspense>
      ),
    },
    {
      path: "update/:id",
      element: (
        <Suspense fallback={Loading}>
          <CommunityUpdatePage />
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
      path: "communityList",
      element: (
        <Suspense fallback={Loading}>
          <CommunityListPage />
        </Suspense>
      ),
    },
    {
      path: "tabList/:tabId",
      element: (
        <Suspense fallback={Loading}>
          <TabListPage />
        </Suspense>
      ),
    },
    {
      path: "tabList",
      element: (
        <Suspense fallback={Loading}>
          <TabListPage />
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
  ];
};

export default toCommunityRouter;
