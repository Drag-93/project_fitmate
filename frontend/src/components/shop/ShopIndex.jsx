import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_SERVER_URL } from "../../apis/commonApi";
import jwtAxios from "../../apis/util/jwtUtil";
import axios from "axios";
// Swiper 필요하면 추가
// import { Swiper } from "swiper/types";

const ShopIndex = () => {
  //로그인 여부 판단
  const user = useSelector((state) => state.loginSlice); //user 정보
  const isLogin = !!user?.userEmail;
  const API_URL = API_SERVER_URL;

  // 추천기능 변수
  const [productList, setProductList] = useState([]);
  //베스트 상품
  const bestProduct = productList[0];
  //top 2~5
  const otherProducts = productList.slice(1);

  // 추천 리스트 가져오는 함수
  const getProductData = async () => {
    try {
      const res = isLogin
        ? await jwtAxios.get(`${API_URL}/api/main`) //로그인 상태일때 jwtAxios 사용
        : await axios.get(`${API_URL}/api/main`); //비로그인 상태일때 그냥 axios 사용

      setProductList(res.data.productList || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      <div className="shopIndex">
        <div className="shopIndex-wrap">
          <div className="shopIndex-top">
            <div className="shopIndex-top-con">
              {/* Swiper 배너 */}
              {/* <div className="slides-container">
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
                  Navigation={true}
                  className="main-banner-swiper"
                >
                  <SwiperSlide>
                    <a href="/shop">
                      <img
                        src="/images/test/banner1.jpg"
                        alt="메인 배너 테스트1"
                      />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide>
                    <a href="/shop">
                      <img
                        src="/images/test/banner2.jpg"
                        alt="메인 배너 테스트1"
                      />
                    </a>
                  </SwiperSlide>
                </Swiper>
              </div> */}
            </div>
          </div>
          {/* 베스트 셀러 
              로그인 시 해당 관심사(없으면 비로그인과 동일)
              가장 많이 팔린 상품 노출*/}
          <div className="shopIndex-best">
            {bestProduct && (
              <li
                key={bestProduct.id}
                // style={{ display: `flex`, justifyContent: `end` }}
              >
                <a
                  href={`/products/detail/${bestProduct.id}`}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <img
                    // src={`${API_SERVER_URL}/upload/product/${bestProduct.newFileName}`}
                    src=""
                    alt={bestProduct.productName}
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
          </div>

          <div className="shopIndex-bottom">
            <div className="shopIndex-bottom-con">
              <div className="shopIndex-bottom-productList">
                {/* 상품 리스트 -> 강제 style 적용 -> css적용 시 변경 */}
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
                        <a href={`/products/detail/${product.id}`}>
                          <img
                            // src={`${API_SERVER_URL}/upload/product/${product.newFileName}`}
                            src=""
                            alt={product.productName}
                            style={{
                              width: `10vh`,
                              height: `10vh`,
                            }}
                          />
                          {/* <img
                            src={`/images/test/test${product.id}.jpg`}
                            alt="테스트용 이미지"
                            style={{
                              width: `10vh`,
                              height: `10vh`,
                            }}
                          /> */}
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
          {/* 변경사항 있을시 추가 작성*/}
          {/* <div className="shopIndex-left">
            <div className="shopIndex-left-con"></div>
          </div>
          <div className="shopIndex-right">
            <div className="shopIndex-right-con"></div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ShopIndex;
