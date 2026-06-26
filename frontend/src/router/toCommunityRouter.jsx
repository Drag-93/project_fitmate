import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div className="loading">...Loading</div>;

const CommunityIndexPage = lazy(
  () => import("../page/community/CommunityIndexPage"),
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
  ];
};

export default toCommunityRouter;
