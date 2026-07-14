import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_SERVER_URL } from "../apis/commonApi";
import jwtAxios from "../apis/util/jwtUtil";
import { useSelector } from "react-redux";
import "../components/css/main/Main.css";
//배너 swiper 관련
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Main = () => {
  //로그인 여부 판단
  const user = useSelector((state) => state.loginSlice); //user 정보
  const isLogin = !!user?.userEmail;
  const API_URL = API_SERVER_URL;
  // 게시글 리스트 변수
  const [selectMenu, setSelectMenu] = useState("notice");

  // 추천기능 변수
  const [communityList, setCommunityList] = useState([]);
  const [productList, setProductList] = useState([]);

  //베스트 상품
  const bestProduct = productList[0];
  //top 2~5
  const otherProducts = productList.slice(1);

  //공지사항 변수
  const [noticeList, setNoticeList] = useState([]);

  //팝업 변수
  const [popupList, setPopupList] = useState([]);

  //오늘 하루 그만 보기
  const closeToday = (popupId) => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`mainPopupHideDate_${popupId}`, today);

    setPopupList((prev) => prev.filter((popup) => popup.id !== popupId));
  };
  //팝업 닫기
  const closePopup = (popupId) => {
    setPopupList((prev) => prev.filter((popup) => popup.id !== popupId));
  };

  // 추천 리스트 가져오는 함수
  const getMainData = async () => {
    try {
      const res = isLogin
        ? await jwtAxios.get(`${API_URL}/api/main`) //로그인 상태일때 jwtAxios 사용
        : await axios.get(`${API_URL}/api/main`); //비로그인 상태일때 그냥 axios 사용

      setCommunityList(res.data.communityList || []);
      setProductList(res.data.productList || []);
      setNoticeList(res.data.noticeList || []);

      //팝업
      const today = new Date().toISOString().slice(0, 10);

      const visiblePopupList = (res.data.popupList || []).filter((popup) => {
        const today = new Date().toISOString().slice(0, 10);
        const hideDate = localStorage.getItem(`mainPopupHideDate_${popup.id}`);

        return hideDate !== today;
      });

      setPopupList(visiblePopupList.slice(0, 2));
      // console.log(res.data);
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
      {/* 팝업 모달 */}
      {popupList.length > 0 && (
        <div className="main-popup-area">
          {popupList.map((popup, index) => (
            <div
              className="main-popup"
              key={popup.id}
              style={{
                left: `${80 + index * 360}px`,
              }}
            >
              <button
                className="main-popup-close"
                onClick={() => closePopup(popup.id)}
              >
                ×
              </button>

              <a href={popup.linkUrl || "#"}>
                {popup.newFileName && (
                  <img
                    src={`${API_SERVER_URL}/upload/popup/${popup.newFileName}`}
                    alt={popup.title}
                  />
                )}
              </a>

              <h3>{popup.title}</h3>
              <p>{popup.content}</p>

              <div className="main-popup-bottom">
                <button onClick={() => closeToday(popup.id)}>
                  오늘 그만보기
                </button>
                <button onClick={() => closePopup(popup.id)}>닫기</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="main">
        <div className="main-wrap">
          <div className="main-top">
            <div className="main-top-con">
              <div className="slides-container">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  navigation={true}
                  className="main-banner-swiper"
                >
                  <SwiperSlide>
                    <a href="/store">
                      <img
                        src="/images/test/banner1.jpg"
                        alt="메인 배너 테스트1"
                      />
                    </a>
                  </SwiperSlide>

                  <SwiperSlide>
                    <a href="/store">
                      <img
                        src="/images/test/banner2.jpg"
                        alt="메인 배너 테스트1"
                      />
                    </a>
                  </SwiperSlide>
                </Swiper>
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
                                <a href={`/community/detail/${notice.id}`}>
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
                                <a href={`/community/detail/${community.id}`}>
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
                              src={`/images/test/test${bestProduct.id}.jpg`}
                              alt="테스트이미지"
                              style={{
                                width: `30vh`,
                                height: `30vh`,
                              }}
                            />
                          </a>
                          <p>{bestProduct.productName}</p>
                          <span>{bestProduct.price?.toLocaleString()}원</span>
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
                          <img
                            src={`/images/test/test${product.id}.jpg`}
                            alt="테스트용 이미지"
                            style={{
                              width: `10vh`,
                              height: `10vh`,
                            }}
                          />
                        </a>
                        <p>{product.productName}</p>
                        <span>{product.price?.toLocaleString()}원</span>
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
