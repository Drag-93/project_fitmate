import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProductList } from "../../../apis/store/productApi";
import ProductCard from "../../../components/store/product/ProductCard";

import "../../../components/css/store/product/ProductListPage.css";

const ProductListPage = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productType = searchParams.get("productType");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [productType, page]);

  const loadProducts = async () => {
    try {
      const res = await getProductList(productType, page, 100);
      setProducts(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
        <div className="product-list">
        <div className="product-list-con">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductListPage;