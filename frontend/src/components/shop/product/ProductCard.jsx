import { useNavigate } from "react-router-dom";
import { API_SERVER_URL } from "../../../apis/commonApi";
import { useEffect, useState } from "react";
import { checkSubscribe } from "../../../apis/shop/memberProductApi";

const ProductCard = ({ product }) => {

  const navigate = useNavigate();
  // 프리미엄 구독 여부
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
    checkSubscribe()
      .then((result) => setSubscribe(result))
      .catch(() => { });
  }, []);
  // 프리미엄 회원 5% 할인
  const discountPrice =
    subscribe && product.productType !== "PREMIUM"
      ? Math.floor(product.price * 0.95) // 
      : product.price;
  const thumbnail = product.fileDtos?.find(
    file => file.imageType === "THUMBNAIL"
  );

  return (
    <div className="product-card"
      onClick={() => navigate(`/products/detail/${product.id}`)}
    >
      {thumbnail ? (<img
        src={`${API_SERVER_URL}/upload/product/${thumbnail.newFileName}`}
        alt={product.productName} />
      ) : (
        <div>이미지 없음</div>)}

      <h3>{product.productName}</h3>

      {subscribe && product.productType !== "PREMIUM" ? (
        <div className="price-area">
          <span className="origin-price">
            {product.price.toLocaleString()}원
          </span>

          <span className="discount-price">
            {discountPrice.toLocaleString()}원
          </span>

        </div>
      ) : (
        <p className="normal-price">
          {product.price.toLocaleString()}원
        </p>
      )}
    </div>
  );
};

export default ProductCard;