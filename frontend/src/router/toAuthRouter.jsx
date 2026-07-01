import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoginPage from "../page/auth/LoginPage";
import JoinPage from "../page/auth/JoinPage";
const Loading = <div className="loading">...Loading</div>;

const toAuthRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"/auth/login"} />,
    },
    {
      path: "login",
      element: (
        <Suspense fallback={Loading}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "join",
      element: (
        <Suspense fallback={Loading}>
          <JoinPage />
        </Suspense>
      ),
    },
  ];
};

export default toAuthRouter;
