import React from "react";
import { Link } from "react-router-dom";
import "../css/admin/AdminHeader.css";

const AdminHeader = () => {
  return (
    <>
      <div className="admin-header" onMouseLeave={() => setActiveMenu(null)}>
        <div className="admin-header-con">
          <div className="admin-nav-wrap">
            <div className="admin-gnb-right">
              <ul>
                <li>
                  <Link to={`/store`}>스토어</Link>
                </li>
                <li>
                  <Link to={`/community`}>게시판</Link>
                </li>
                <li>
                  <h1>이름 님</h1>
                </li>
                <li>
                  <button>로그아웃</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
