import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../css/admin/AdminLeft.css";

const AdminLeft = ({ isMobile, show, onClose }) => {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className={`admin-left`}>
      <div className="admin-left-con">
        <h1 className="logo">
          <Link to={"/"}>
            <img src={""} alt="logo" />
          </Link>
        </h1>
        {/* {isMobile && show && (
          <span className="adminLeftCloseBtn" onClick={onClose}>
            X
          </span>
        )} */}

        <ul>
          <li>
            <NavLink
              to={"/admin/member"}
              className={linkClass}
              onClick={onClose}
            >
              회원
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/product"}
              className={linkClass}
              onClick={onClose}
            >
              상품
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/order"}
              className={linkClass}
              onClick={onClose}
            >
              상품결제
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/community"}
              className={linkClass}
              onClick={onClose}
            >
              게시판
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminLeft;
