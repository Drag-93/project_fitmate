import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/common/Header.css";
const Header = () => {
  // 검색기능변수
  const [keyword, setKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  //메뉴 depth 기능 -> onMouseEnter시 오픈
  const [activeMenu, setActiveMenu] = useState(null);

  //header 검색기능
  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // 검색 페이지로 검색어를 포함해 이동
    setIsSearchOpen(false);
    navigate(`/search?search=${encodeURIComponent(keyword)}`); //검색어 encoding ->데이터에 포함된 특수문자나 공백이 URL의 구조를 깨뜨리거나 변조되는 것을 방지
    setKeyword(""); // 입력창 비우기
  };
  return (
    <>
      <div className="header" onMouseLeave={() => setActiveMenu(null)}>
        <div className="header-con">
          <div className="nav-wrap">
            <div className="gnb-left">
              <ul>
                <li onMouseEnter={() => setActiveMenu("store")}>
                  <Link to={`/store`}>스토어</Link>
                </li>
                <li onMouseEnter={() => setActiveMenu("community")}>
                  <Link to={`/community`}>게시판</Link>
                </li>
              </ul>
            </div>
            <div className="gnb-logo">
              <Link to={`/`}>
                <h1>logo</h1>
              </Link>
            </div>
            <div className={`header_search ${isSearchOpen ? "active" : ""}`}>
              <form className="search-bar" onSubmit={handleSearch}>
                <div className="search_box">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요"
                  />
                  <button type="submit" className="search-btn">
                    검색
                  </button>
                </div>
                <span
                  className="search-close"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setKeyword(""); // 검색어도 같이 초기화
                  }}
                >
                  ×
                </span>
              </form>
            </div>
            <div className="gnb-right">
              <ul>
                <span
                  className="header_auth_btn header_search_btn"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <img
                    src="/images/magnifier-icon.png"
                    alt="돋보기 아이콘"
                    style={{ width: "25px", height: "25px" }}
                  />
                </span>
                <li>
                  <Link to={`/login`}>로그인</Link>
                </li>
                <li>
                  <Link to={`/join`}>회원가입</Link>
                </li>
                <li>
                  <Link to={`/cart`}>장바구니</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={`header_depth ${activeMenu ? "active" : ""}`}>
            {activeMenu === "store" && (
              <ul>
                <li>
                  <Link to={`/store`}>스토어</Link>
                  <Link to={`/store`}>운동기구</Link>
                  <Link to={`/store`}>식품</Link>
                  <Link to={`/store`}>스토어3</Link>
                </li>
                <li>
                  <Link to={`/store`}>구독상품</Link>
                  <Link to={`/store`}>헬스장</Link>
                  <Link to={`/store`}>식단</Link>
                  <Link to={`/store`}>구독3</Link>
                </li>
              </ul>
            )}
            {activeMenu === "community" && (
              <ul>
                <li>
                  <Link to={`/community/notice`}>공지사항</Link>
                  <Link to={`/community/`}>자주 묻는 질문</Link>
                  <Link to={`/community/qna`}>Q&A</Link>
                </li>

                <li>
                  {/* 카테고리 늘어나면 추가될 수 있도록 제작 */}
                  <Link to={`/community`}>커뮤니티</Link>
                  <Link to={`/community`}>카테고리1</Link>
                  <Link to={`/community`}>카테고리2</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
