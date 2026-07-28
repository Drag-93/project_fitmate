import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminLeft from "../components/admin/AdminLeft";
import "../css/admin/Admin.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const AdminLayout = () => {
  const navigate = useNavigate();
  //authSlice에 저장된 멤버데이터를 가져옴
  const { memberData } = useSelector((state) => state.loginSlice);

  const role = memberData?.result?.role;
  const isLogin = !!memberData?.result?.userEmail;

  const isAdminOrManager = role === "ADMIN" || role === "MANAGER";
  const hasAccess = isLogin && isAdminOrManager;

  useEffect(() => {
    if (!hasAccess) {
      alert("접근 권한이 없습니다.");
      navigate("/", { replace: true });
    }
  }, [hasAccess, navigate]);

  if (!hasAccess) return null;

  return (
    <>
      <AdminHeader />
      <Outlet />
      <AdminLeft />
    </>
  );
};

export default AdminLayout;
