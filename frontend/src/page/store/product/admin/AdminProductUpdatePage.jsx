import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProductDetail,
  updateProduct,
  deleteImage,
  deleteAllImages
} from "../../../../apis/store/productApi";

import ProductForm from "../../../../components/store/product/admin/ProductForm";
import ImageUpload from "../../../../components/store/product/admin/ImageUpload";
import "../../../../components/css/store/product/admin/ProductAdmin.css";



const AdminProductUpdatePage = () => {

  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [images, setImages] = useState({
    thumbnail: null,
    main: [],
    details: []
  });

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {

    try {
      const res = await getProductDetail(productId);
      setProduct(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // 이미지 추가
  const handleImageChange = (imageData) => {

    setImages(imageData);
  };


  // 이미지 개별 삭제
  const handleDeleteImage = async (fileId) => {
    try {
      await deleteImage(fileId);
      alert("이미지가 삭제되었습니다.");
      loadProduct();
    } catch(e) {
      console.error(e);
    }
  };

  // 이미지 전체 삭제
  const handleDeleteAllImages = async () => {

    if(!window.confirm("모든 이미지를 삭제하시겠습니까?")){
      return;
    }
    try {
      await deleteAllImages(productId);
      alert("전체 삭제되었습니다.");
      loadProduct();
    } catch(e){
      console.error(e);
    }
  };


  // 수정
  const handleSubmit = async(formData) => {

    const data = new FormData();

    data.append(
      "productDto",
      new Blob(
        [JSON.stringify(formData)],
        {
          type:"application/json"
        }
      )
    );

    if(images.thumbnail){
      data.append(
        "thumbnail",
        images.thumbnail
      );
    }

    images.main.forEach(file => {
      data.append(
        "main",
        file
      );
    });

    images.details.forEach(file => {
      data.append(
        "details",
        file
      );
    });

    try {
      await updateProduct(
        productId,
        data
      );
      alert("수정되었습니다.");
      navigate("/store/admin/product");

    }catch(e){
      console.error(e);
      alert("수정 실패");
    }
  };

  if(!product){
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-product-update">
      <h2> 상품 수정 </h2>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
      />

      <ImageUpload
        onChange={handleImageChange}
      />

      <div>
        <button
          onClick={handleDeleteAllImages}
        >
          이미지 전체 삭제
        </button>
      </div>

      <div className="image-list">
        {
          product.productFileDtos?.map(file => (
            <div key={file.id}>
              <img
                src={file.newFileName}
                width="100"
              />

              <button
                onClick={() =>
                  handleDeleteImage(file.id)
                }
              >
                삭제
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
};


export default AdminProductUpdatePage;