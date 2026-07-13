import { useNavigate } from "react-router-dom";

import "../../../components/css/store/product/ProductCard.css"

const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  const thumbnail = product.productFileDtos?.find(
    file => file.imageType === "THUMBNAIL"  
  );

  return (
    <div  className="product-card"
      onClick={() => navigate(`/products/detail/${product.id}`)}
    >
      <img src={`http://localhost:8090${thumbnail?.newFileName}`} alt={product.productName} />

      <h3>{product.productName}</h3>

      <p>{product.price.toLocaleString()}원</p>
    </div>
  );
};

export default ProductCard;