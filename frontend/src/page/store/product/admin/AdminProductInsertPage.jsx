import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { insertProduct } from "../../../../apis/store/productApi";

import ProductForm from "../../../../components/store/product/admin/ProductForm";
import ImageUpload from "../../../../components/store/product/admin/ImageUpload";


const AdminProductInsertPage = () => {

  const navigate = useNavigate();

  const [images, setImages] = useState({
    thumbnail: null,
    main: [],
    details: []
  });

  // 이미지 전달 받기
  const handleImageChange = (imageData) => {
    console.log(images);
    setImages(imageData);
  };

  // 상품 등록
  const handleSubmit = async(productData) => {
    const formData = new FormData();
    // ProductDto JSON
    formData.append(
      "productDto",
      new Blob(
        [
          JSON.stringify(productData)
        ],
        {
          type:"application/json"
        }
      )
    );


    // 썸네일
    if(images.thumbnail){
      formData.append(
        "thumbnail",
        images.thumbnail
      );
    }


    // 메인 이미지 여러 장
    images.main.forEach(file => {
      formData.append(
        "main",
        file
      );
    });


    // 상세 이미지 여러 장
    images.details.forEach(file => {
      formData.append(
        "details",
        file
      );
    });



    try {
      await insertProduct(formData);

      alert("상품이 등록되었습니다.");

      navigate("/store/admin/product");

    } catch(e){
      console.error(e);
      alert("상품 등록 실패");
    }
  };

  return (
    <div className="admin-product-insert">

      <h2> 상품 등록 </h2>

      <ProductForm
        onSubmit={handleSubmit}
      />

      <ImageUpload
        onChange={handleImageChange}
      />
    </div>
  );
};


export default AdminProductInsertPage;