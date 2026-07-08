import { useNavigate } from "react-router-dom";

const ProductRow = ({ product, onEdit, onDelete }) => {

  const navigate = useNavigate();

  const thumbnail = product.productFileDtos?.find(
    file => file.imageType === "THUMBNAIL"
  );

  return (
    <tr>
      <td>{product.id}</td>
      <td>
        {thumbnail ? (
          <img
            src={thumbnail.newFileName}
            alt={product.productName}
            width={80}
            height={80}
            style={{
              objectFit: "cover",
              borderRadius: "6px"
            }}
          />
        ) : (
          <span>이미지 없음</span>
        )}
      </td>
      <td>{product.productName}</td>
      <td>{product.category}</td>
      <td>{product.productType}</td>
      <td>{product.billingType}</td>
      <td>{product.price.toLocaleString()}원</td>
      <td>{product.productStatus}</td>

      <td>
        <button
          onClick={() =>
            navigate(`/store/admin/product/update/${product.id}`)
          }
        >
          수정
        </button>

        <button
          onClick={() => onDelete(product.id)}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;