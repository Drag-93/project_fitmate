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
      path: "communityList",
      element: (
        <Suspense fallback={Loading}>
          <CommunityListPage />
        </Suspense>
      ),
    },
  ];
};

export default toCommunityRouter;
