import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_SERVER_URL } from "../../apis/commonApi";
import jwtAxios from "../../apis/util/jwtUtil";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
  // 트레이너 정보
  const [trainerList, setTrainerList] = useState([]);
  const [products, setProducts] = useState([]);
  const getTrainerList = async () => {
    try {
      const res = await jwtAxios.get(`${API_URL}/api/trainer/list`);
      console.log(res.data);
      const trainers = res.data || [];
      // 3개 카드 고정
      const fixedTrainers = [
        trainers[0] || null,
        trainers[1] || null,
        trainers[2] || null,
      ];

      setTrainerList(fixedTrainers);
    } catch (err) {
      console.error("트레이너 조회 실패", err);
      setTrainerList([null, null, null]);
    }
  };
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
    const getProducts = async () => {
      try {
        const res = await jwtAxios.get(`${API_URL}/api/products`);

        setProducts(res.data.content || res.data);
      } catch (err) {
        console.log("상품 조회 실패", err);
      }
    };

    getProducts();
  }, []);
  useEffect(() => {
    getProductData();
    getTrainerList();
  }, [isLogin]);
  return (
    <>
      <div className="shopIndex">
        <div className="shopIndex-wrap">
          <div className="shopIndex-top">
            <div className="shopIndex-top-con">
              {/* Swiper 배너 */}
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
                  Navigation={true}
                  className="shop-banner-swiper"
                >
                  <SwiperSlide>
                    <a href="/products?productType=GYM">
                      <img src="/images/shop/gymbanner.png" alt="헬스장 배너" />
                    </a>
                  </SwiperSlide>
                  <SwiperSlide>
                    <a href="/products?productType=PT">
                      <img
                        src="/images/shop/trainerbanner.png"
                        alt="트레이너 배너"
                      />
                    </a>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>

          <div className="trainer-section">
            <h2>FitMate 전문 트레이너</h2>

            <div className="trainer-list">
              {trainerList.map((trainer, index) => (
                <div className="trainer-card" key={index}>
                  {trainer ? (
                    <>
                      <img
                        src={
                          trainer?.profileImage
                            ? `${API_SERVER_URL}/upload/member/${trainer.profileImage}`
                            : "/images/default-profile.png"
                        }
                        alt="트레이너 프로필"
                      />

                      <h3>{trainer.name}</h3>

                      <p>{trainer.specialty || "전문 분야 준비중"}</p>

                      <span>{trainer.career || "경력 정보 준비중"}</span>
                      <span>{trainer.certificate || " "}</span>
                    </>
                  ) : (
                    <>
                      <div className="empty-profile">+</div>

                      <h3>트레이너 준비중</h3>

                      <p>곧 새로운 트레이너가 등록됩니다</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="shopIndex-bottom">
            <div className="shopIndex-bottom-con">
              <div className="shopIndex-bottom-productList">
                {products.slice(0, 8).map((product) => (
                  <div className="product-card" key={product.id}>
                    <img
                      src={`${API_SERVER_URL}${
                        product.productFileDtos?.find(
                          (file) => file.imageType === "THUMBNAIL",
                        )?.newFileName
                      }`}
                      alt={product.productName}
                    />

                    <div className="product-name">{product.productName}</div>

                    <div className="product-price">
                      {product.price.toLocaleString()}원
                    </div>
                  </div>
                ))}
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
