import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_SERVER_URL } from "../apis/commonApi";
import { jsx } from "react/jsx-runtime";
import jwtAxios from "../apis/util/jwtUtil";

const Main = () => {
  const API_URL = API_SERVER_URL;
  // 게시글 리스트 변수
  const [selectMenu, setSelectMenu] = useState("notice");

  // 추천기능 변수
  const [communityList, setCommunityList] = useState("");
  const [productList, setProductList] = useState("");

  //베스트 상품
  const bestProduct = productList[0];
  //top 2~5
  const otherProducts = productList.slice(1);

  //공지사항 변수
  const [noticeList, setNoticeList] = useState("");

  // 추천 리스트 가져오는 함수
  const getMainData = async () => {
    try {
      const res = await jwtAxios.get(`${API_URL}/main`);

      setCommunityList(res.data.communityList || []);
      setProductList(res.data.productList || []);
      setNoticeList(res.data.noticeList || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getMainData();
  }, []);

  //스크롤 버튼 -> scroll y ->300이면 top버튼 show
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //스크롤 최상위 버튼
  const moveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="main">
        <div className="main-wrap">
          <div className="main-top">
            <div className="main-top-con">
              <div className="slides-container">
                {/* swipe 라이브러리 사용할지, 그냥 배너 한장만 넣을지 선택 */}
                <ul className="slides-list">
                  <li style={{ display: `flex`, justifyContent: `center` }}>
                    <a href="/store">
                      <img
                        src="/images/test1.jpg"
                        alt="테스트이미지"
                        style={{
                          width: `40vh`,
                          height: `40vh`,
                        }}
                      />
                      <del>배너 위치(delete)</del>
                    </a>
                  </li>
                  <li style={{ display: `none`, justifyContent: `center` }}>
                    <a href="/store">
                      <img
                        src="/images/test2.jpg"
                        alt="테스트이미지2"
                        style={{
                          width: `40vh`,
                          height: `40vh`,
                        }}
                      />
                    </a>
                  </li>
                  <li style={{ display: `none`, justifyContent: `center` }}>
                    <a href="/store">
                      <img
                        src="/images/test3.jpg"
                        alt="테스트이미지3"
                        style={{
                          width: `40vh`,
                          height: `40vh`,
                        }}
                      />
                    </a>
                  </li>
                  <li style={{ display: `none`, justifyContent: `center` }}>
                    <a href="/store">
                      <img
                        src="/images/test4.jpg"
                        alt="테스트이미지4"
                        style={{
                          width: `40vh`,
                          height: `40vh`,
                        }}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="main-center">
            <div
              className="main-center-con"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* 게시판 내용, 추천 게시글, 베스트 게시글 */}
              <div className="main-left">
                <div className="main-left-con">
                  <div className="main-left-header">
                    <ul
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <li onClick={() => setSelectMenu("notice")}>공지사항</li>
                      <li onClick={() => setSelectMenu("best")}>베스트</li>
                    </ul>
                    <div className="main-left-depth">
                      {selectMenu === "notice" && (
                        <ul>
                          {Array.isArray(noticeList) &&
                            noticeList.map((notice) => (
                              <li key={notice.id}>
                                <a href={`/community/notice/${notice.id}`}>
                                  <p>{notice.title}</p>
                                </a>
                              </li>
                            ))}
                        </ul>
                      )}
                      {selectMenu === "best" && (
                        <ul>
                          {Array.isArray(communityList) &&
                            communityList.map((community) => (
                              <li key={community.id}>
                                <a href={`/community/${community.id}`}>
                                  <p>{community.title}</p>
                                </a>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* 베스트셀러, 상품 이미지 -> 아래에 상품 있어서 없어도 되나 */}
              <div className="main-right">
                <div className="main-right-con">
                  <div className="main-right-slide">
                    <ul>
                      {bestProduct && (
                        <li
                          key={bestProduct.id}
                          // style={{ display: `flex`, justifyContent: `end` }}
                        >
                          <a
                            href={`/store/detail/${bestProduct.id}`}
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <img
                              src="/images/test2.jpg"
                              alt="테스트이미지"
                              style={{
                                width: `30vh`,
                                height: `30vh`,
                              }}
                            />
                          </a>
                          <p>{bestProduct.productName}</p>
                          <span>{bestProduct.price.toLocaleString()}원</span>
                          <p>
                            <del>베스트 상품 </del>
                          </p>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 이벤트, 상품 이미지 -> grid*/}
          <div className="main-bottom">
            <div className="main-bottom-con">
              <div
                className="main-bottom-event"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <a href="/store">
                  <del>이벤트이미지</del>
                  <img src="" alt="이벤트 이미지" />
                </a>
              </div>
              <div className="main-bottom-itemList">
                <ul
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(1, 1fr)",
                    gridAutoRows: "1fr",
                    gap: "3rem",
                  }}
                >
                  {Array.isArray(otherProducts) &&
                    otherProducts.map((product) => (
                      <li key={product.id}>
                        <a href={`/store/detail/${product.id}`}>
                          {/* <img src={product.productImage} alt={product.productName} /> */}
                          <img src="" alt="베스트상품" />
                        </a>
                        <p>{product.productName}</p>
                        <span>{product.price.toLocaleString()}원</span>
                        <p>
                          <del>베스트상품</del>
                        </p>
                      </li>
                    ))}

                  <li style={{ display: "flex", flexDirection: "column" }}>
                    <a href="/store">
                      <img
                        src="/images/test4.jpg"
                        alt="테스트이미지"
                        style={{
                          width: `10vh`,
                          height: `10vh`,
                        }}
                      />
                    </a>
                    <del>상품 목록5</del>
                  </li>
                  <li style={{ display: "flex", flexDirection: "column" }}>
                    <a href="/store">
                      <img
                        src="/images/test3.jpg"
                        alt="테스트이미지"
                        style={{
                          width: `10vh`,
                          height: `10vh`,
                        }}
                      />
                    </a>
                    <del>상품 목록6</del>
                  </li>
                  <li style={{ display: "flex", flexDirection: "column" }}>
                    <a href="/store">
                      <img
                        src="/images/test2.jpg"
                        alt="테스트이미지"
                        style={{
                          width: `10vh`,
                          height: `10vh`,
                        }}
                      />
                    </a>
                    <del>상품 목록7</del>
                  </li>
                  <li style={{ display: "flex", flexDirection: "column" }}>
                    <a href="/store">
                      <img
                        src="/images/test1.jpg"
                        alt="테스트이미지"
                        style={{
                          width: `10vh`,
                          height: `10vh`,
                        }}
                      />
                    </a>
                    <del>상품 목록8</del>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* 스크롤 버튼 */}
          {showTopBtn && (
            <button className="top-btn" onClick={moveToTop}>
              Top ↑
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
