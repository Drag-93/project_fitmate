import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div className="loading">...Loading</div>;

const MemberDetailPage = lazy(() => import("../page/member/MemberDetailPage"));

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
  ];
};

export default toMemberRouter;
