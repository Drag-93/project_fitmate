import React, { lazy, Suspense } from "react";

const Loading = <div className="loading">...Loading</div>;

const ProductListPage = lazy(
  () => import("../page/store/product/ProductListPage"),
);
const CategoryPage = lazy(() => import("../page/store/product/CategoryPage"));
const ProductDetailPage = lazy(
  () => import("../page/store/product/ProductDetailPage"),
);

const toProductsRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <ProductListPage />
        </Suspense>
      ),
    },
    {
      path: "category/:category",
      element: (
        <Suspense fallback={Loading}>
          <CategoryPage />
        </Suspense>
      ),
    },
    {
      path: "detail/:productId",
      element: (
        <Suspense fallback={Loading}>
          <ProductDetailPage />
        </Suspense>
      ),
    },
  ];
};

export default toProductsRouter;
