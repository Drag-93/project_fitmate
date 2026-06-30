import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="nav-wrap">
          <div className="gnb-left">
            <ul>
              <li>
                <Link to={"/store"}>스토어</Link>
              </li>
              <li>
                <Link to={"/community"}>게시판</Link>
              </li>
            </ul>
          </div>
          <div className="gnb-logo">
            <Link to={"/"}>
              <h1>logo</h1>
            </Link>
          </div>
          <div className="gnb-right">
            <ul>
              <li>
                <Link to={"/login"}>로그인</Link>
              </li>
              <li>
                <Link to={"/join"}>회원가입</Link>
              </li>
              <li>
                <Link to={"/cart"}>장바구니</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
