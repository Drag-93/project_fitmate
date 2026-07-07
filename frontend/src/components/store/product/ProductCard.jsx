import { useNavigate } from "react-router-dom";

import "../../../components/css/store/ProductCard.css"

const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  const thumbnail = product.productFileDtos?.find(
    file => file.imageType === "THUMBNAIL"
  );
  return (
    <div
      onClick={() => navigate(`/products/detail/${product.id}`)}
    >
      <img src={thumbnail?.newFileName} alt={product.productName} />

      <h3>{product.productName}</h3>

      <p>{product.price.toLocaleString()}원</p>
    </div>
  );
};

export default ProductCard;