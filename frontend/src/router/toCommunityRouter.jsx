import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div className="loading">...Loading</div>;

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
const TabListPage = lazy(() => import("../page/community/TabListPage"));
const RoutinePage = lazy(() => import("../page/community/RoutinePage"));
const CommunityMainPage = lazy(
  () => import("../page/community/CommunityMainPage"),
);

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
          <CommunityMainPage />
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
      path: "routine",
      element: (
        <Suspense fallback={Loading}>
          <RoutinePage />
        </Suspense>
      ),
    },
    {
      path: "tab/:tabId",
      element: (
        <Suspense fallback={Loading}>
          <CommunityListPage />
        </Suspense>
      ),
    },
    {
      path: "tab/:tabId/category/:categoryId",
      element: (
        <Suspense fallback={Loading}>
          <CommunityListPage />
        </Suspense>
      ),
    },
  ];
};

export default toCommunityRouter;
