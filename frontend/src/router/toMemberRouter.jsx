import React, { lazy, Suspense } from "react";

const Loading = <div className="loading">...Loading</div>;

const MemberDetailPage = lazy(() => import("../page/member/MemberDetailPage"));
const MemberUpdatePwPage = lazy(
  () => import("../page/member/MemberUpdatePwPage"),
);

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
    {
      path: "updatepw",
      element: (
        <Suspense fallback={Loading}>
          <MemberUpdatePwPage />
        </Suspense>
      ),
    },
  ];
};

export default toMemberRouter;
