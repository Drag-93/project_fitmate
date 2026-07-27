import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../css/admin/AdminLeft.css";
import { useSelector } from "react-redux";
import { API_SERVER_URL } from "../../apis/commonApi";

const AdminLeft = ({ isMobile, show, onClose }) => {
  //로그인 여부 판단
  const { memberData } = useSelector((state) => state.loginSlice); //user 정보
  const isLogin = !!memberData?.result?.userEmail;
  //권한
  const role = memberData?.result?.role;

  const API_URL = API_SERVER_URL;

  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <>
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
                to={"/admin/index"}
                className={linkClass}
                onClick={onClose}
              >
                대시보드
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/admin/calendar"}
                className={linkClass}
                onClick={onClose}
              >
                캘린더
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/admin/member"}
                className={linkClass}
                onClick={onClose}
              >
                회원
              </NavLink>
            </li>
            {isLogin && ["ADMIN", "MANAGER"].includes(role) && (
              <>
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
                    주문/결제
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
                <li>
                  <NavLink
                    to={"/admin/popup"}
                    className={linkClass}
                    onClick={onClose}
                  >
                    팝업
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/chatbot"}
                    className={linkClass}
                    onClick={onClose}
                  >
                    챗봇관리
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminLeft;
