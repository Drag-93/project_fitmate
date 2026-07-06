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
const TabInsertPage = lazy(() => import("../page/community/TabInsertPage"));
const TabListPage = lazy(() => import("../page/community/TabListPage"));

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
      path: "category/:categoryId",
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
  ];
};

export default toCommunityRouter;
