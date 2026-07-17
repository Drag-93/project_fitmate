import { useNavigate } from "react-router-dom";

import "../../../components/css/store/product/ProductCard.css"

const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  const thumbnail = product.fileDtos?.find(
    file => file.imageType === "THUMBNAIL"  
  );

  return (
    <div  className="product-card"
      onClick={() => navigate(`/products/detail/${product.id}`)}
    >
      {thumbnail ? (<img
            src={`http://localhost:8090/upload/product/${thumbnail.newFileName}`}
            alt={product.productName}/>
        ) : (
          <div>이미지 없음</div>)}
          
      <h3>{product.productName}</h3>

      <p>{product.price.toLocaleString()}원</p>
    </div>
  );
};

export default ProductCard;