import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// const Loading = <div className="loading">...Loading</div>;

const StoreIndexPage = lazy(() => import("../page/store/StoreIndexPage"));
const AdminProductListPage = lazy(() => import("../page/store/product/admin/AdminProductListPage"));
const AdminProductUpdatePage = lazy(() => import("../page/store/product/admin/AdminProductUpdatePage"));
const AdminProductInsertPage = lazy(() => import("../page/store/product/admin/AdminProductInsertPage"));
const AdminProductDetailPage = lazy(() => import("../page/store/product/admin/AdminProductDetailPage"));

const toStoreRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to="index" />,
    },
    {
      path: "index",
      element: <StoreIndexPage />,
    },
    {
      path: "admin/product",
      element: <AdminProductListPage />,
    },
    {
      path: "admin/product/update/:productId",
      element: <AdminProductUpdatePage />,
    },
    {
      path: "admin/product/insert",
      element: <AdminProductInsertPage />,
    },
    {
      path: "admin/product/detail/:productId",
      element: <AdminProductDetailPage />,
    },
  ];
};

export default toStoreRouter;
