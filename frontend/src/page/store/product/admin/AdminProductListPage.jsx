import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductList, deleteProduct } from "../../../../apis/store/productApi.js";
import ProductTable from "../../../../components/store/product/admin/ProductTable.jsx";

const AdminProductListPage = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductList();
      setProducts(res.data.content);
      setPageInfo(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/store/admin/product/update/${product.id}`);
  };

  const handleDelete = async (productId) => {

    if (!window.confirm("상품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(prev =>
        prev.filter(product => product.id !== productId)
      );
      alert("삭제되었습니다.");

    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  if (loading) { return <div>Loading...</div>; }

  return (
    <div className="admin-product-list">
      <h2>상품 관리</h2>
      <button
        onClick={() => navigate("/store/admin/product/insert")}
      >
        상품 등록
      </button>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminProductListPage;