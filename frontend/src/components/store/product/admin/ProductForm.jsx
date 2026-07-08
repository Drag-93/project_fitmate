import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

const ProductForm = ({ product, onSubmit }) => {

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    productType: "PT",
    billingType: "ONE_TIME",
    productStatus: "ACTIVE",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        description: product.description,
        price: product.price,
        productType: product.productType,
        billingType: product.billingType,
        productStatus: product.productStatus,
        category: product.category,
      });
    }
  }, [product]);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler}>

      <div>
        <label>상품명</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={changeHandler}
        />
      </div>

      <div>
        <label>상품설명</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={changeHandler}
        />
      </div>

      <div>
        <label>가격</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={changeHandler}
        />
      </div>

      <div>
        <label>상품종류</label>
        <select
          name="productType"
          value={formData.productType}
          onChange={changeHandler}
        >
          <option value="PT">PT</option>
          <option value="GYM">GYM</option>
          <option value="GOODS">GOODS</option>
          <option value="SUBSCRIPTION">SUBSCRIPTION</option>
        </select>
      </div>

      <div>
        <label>결제방식</label>
        <select
          name="billingType"
          value={formData.billingType}
          onChange={changeHandler}
        >
          <option value="ONE_TIME">일회성</option>
          <option value="SUBSCRIPTION">정기결제</option>
        </select>
      </div>

      <div>
        <label>상품상태</label>
        <select
          name="productStatus"
          value={formData.productStatus}
          onChange={changeHandler}
        >
          <option value="ACTIVE">판매중</option>
          <option value="SOLDOUT">품절</option>
        </select>
      </div>

      <div>
        <label>카테고리</label>
        <select
          name="category"
          value={formData.category}
          onChange={changeHandler}
        >
          <option value="diet">다이어트</option>
        </select>
      </div>

      <button type="submit">
        {product ? "수정" : "등록"}
      </button>

    </form>
  );
};

export default ProductForm;