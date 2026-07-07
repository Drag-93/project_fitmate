import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProductListPage from "../page/store/product/ProductListPage";
// const Loading = <div className="loading">...Loading</div>;

const StoreIndexPage = lazy(() => import("../page/store/StoreIndexPage"));
const toStoreRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace to={"index"} />,
    },
    {
      path: "index",
      element: <ProductListPage />,
    },
  ];
};

export default toStoreRouter;
