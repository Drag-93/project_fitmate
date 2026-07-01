import React from "react";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import AdminLeft from "../components/admin/AdminLeft";

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
