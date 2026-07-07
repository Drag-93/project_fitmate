import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetail } from "../../../apis/store/productApi";
import { addCart } from "../../../apis/store/cartApi";
import { getCookie } from "../../../apis/util/cookieUtil";
import CartModal from "../../../components/store/cart/CartModal";

import "../../../components/css/store/product/ProductDetailPage.css";

const ProductDetailPage = () => {

  const { productId } = useParams();
  const navigate = useNavigate();

  const [showCartModal, setShowCartModal] = useState(false);
  const [product, setProduct] = useState(null);

  // 수량 상태
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const res = await getProductDetail(productId);
      setProduct(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // 장바구니 추가
  const handleCart = async () => {

    const member = getCookie("member");

    if (!member) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    try {
      await addCart({
        productId: product.id,
        quantity: quantity
      });
      setShowCartModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  // 바로 구매
  const handleBuy = () => {

    const member = getCookie("member");

    if (!member) {
      alert("로그인이 필요합니다.");
      navigate("/auth/login");
      return;
    }

    navigate("/order", {
      state: {
        productId: product.id,
        quantity: quantity
      }
    });

  };

  if (!product) return <div>Loading...</div>;

  const thumbnail = product.productFileDtos.find(
    file => file.imageType === "THUMBNAIL"
  );

  const main = product.productFileDtos.find(
    file => file.imageType === "MAIN"
  );

  const details = product.productFileDtos.filter(
    file => file.imageType === "DETAIL"
  );

  return (
    <div className="product-detail">
      <div className="product-detail-con">

        {/* 썸네일 */}
        {thumbnail && (
          <img
            src={thumbnail.newFileName}
            alt="썸네일"
            className="thumbnail-image"
          />
        )}

        {/* 메인 이미지 */}
        {main && (
          <img
            src={main.newFileName}
            alt={product.productName}
            className="main-image"
          />
        )}

        <h2 className="productName"> {product.productName}</h2>

        <p className="price">{product.price.toLocaleString()}원</p>

        <p className="description">{product.description}</p>

        {/* 수량 조절*/}
        <div className="quantity-box">
          <button
            onClick={() =>
              setQuantity(prev => Math.max(1, prev - 1))
            }> - </button>

          <span>
            {quantity}
          </span>

          <button
            onClick={() =>
              setQuantity(prev => prev + 1)} >  + </button>
        </div>

        {/* 버튼 */}
        <div className="purchase-box">
          <button className="cart-button"
            onClick={handleCart}> 장바구니 </button>
          <button className="buy-button"
            onClick={handleBuy}>바로 구매</button>
        </div>
        {
          showCartModal &&
          <CartModal

            onContinue={() => {
              setShowCartModal(false);
            }}

            onCart={() => {
              navigate("/cart");
            }}

          />
        }
        {/* 상세 이미지 */}
        {details.map(detail => (
          <img
            key={detail.id}
            src={detail.newFileName}
            alt="상세"
            className="detail-image"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;