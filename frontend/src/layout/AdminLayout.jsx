import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminLeft from "../components/admin/AdminLeft";
import "../css/admin/Admin.css";
const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
      <AdminLeft />
    </>
  );
};

export default AdminLayout;
