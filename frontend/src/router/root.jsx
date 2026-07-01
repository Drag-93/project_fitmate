import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import toStoreRouter from "./toStoreRouter";
import toCommunityRouter from "./toCommunityRouter";
import toAdminRouter from "./toAdminRouter";
import toProductsRouter from "./toProductsRouter";
import toCartRouter from "./toCartRouter";
import toOrderRouter from "./toOrderRouter";
import toPaymentRouter from "./toPaymentRouter";

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
    path: 'products',
    element: <Suspense fallback = {Loading}><StoreLayout/></Suspense>,
    children: toProductsRouter()
  },
  {
    path: 'cart',
    element: <Suspense fallback = {Loading}><StoreLayout/></Suspense>,
    children: toCartRouter()
  },
  {
    path: 'order',
    element: <Suspense fallback = {Loading}><StoreLayout/></Suspense>,
    children: toOrderRouter()
  },
  {
    path: 'payment',
    element: <Suspense fallback = {Loading}><StoreLayout/></Suspense>,
    children: toPaymentRouter()
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
]);

export default root;
