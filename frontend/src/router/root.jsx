import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import toStoreRouter from "./toStoreRouter";
import toCommunityRouter from "./toCommunityRouter";
import toAdminRouter from "./toAdminRouter";
import LoginPage from "../page/member/LoginPage";
import JoinPage from "../page/member/JoinPage";

const Loading = (
  <div className="loading">
    <h1>...Loading</h1>
  </div>
);

const MainPage = lazy(() => import("../page/MainPage"));
const StoreLayout = lazy(() => import("../layout/StoreLayout"));
const CommunityLayout = lazy(() => import("../layout/CommunityLayout"));
const AdminLayout = lazy(() => import("../layout/AdminLayout"));

const root = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <MainPage />
      </Suspense>
    ),
  },
  {
    path: "store",
    element: (
      <Suspense fallback={Loading}>
        <StoreLayout />
      </Suspense>
    ),
    children: toStoreRouter(),
  },
  {
    path: "community",
    element: (
      <Suspense fallback={Loading}>
        <CommunityLayout />
      </Suspense>
    ),
    children: toCommunityRouter(),
  },
  {
    path: "admin",
    element: (
      <Suspense fallback={Loading}>
        <AdminLayout />
      </Suspense>
    ),
    children: toAdminRouter(),
  },
  //회원가입
  {
    path: "join",
    element: (
      <Suspense fallback={Loading}>
        <JoinPage />
      </Suspense>
    ),
  },
  //로그인
  {
    path: "login",
    element: (
      <Suspense fallback={Loading}>
        <LoginPage />
      </Suspense>
    ),
  },
]);

export default root;
