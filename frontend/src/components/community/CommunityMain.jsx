import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_SERVER_URL } from "../../apis/commonApi";
import "../css/Community/CommunityMain.css";

// 배너 swiper 관련
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CITIES = [
  { code: "Seoul", label: "서울" },
  { code: "Suwon", label: "수원" },
  { code: "Cheonan", label: "천안" },
  { code: "Cheongju", label: "청주" },
  { code: "Jeonju", label: "전주" },
  { code: "Gwangju", label: "광주" },
  { code: "Pohang", label: "포항" },
  { code: "Changwon", label: "창원" },
  { code: "Chuncheon", label: "춘천" },
  { code: "Jeju", label: "제주" },
];

const CommunityMain = () => {
  const [mainData, setMainData] = useState({
    byTab: {},
    all: [],
    tabs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const [weatherMap, setWeatherMap] = useState({});
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_SERVER_URL}/community/main`);
        if (res.data?.result) {
          setMainData(res.data.result);
        }
      } catch (err) {
        console.error("메인페이지 데이터 로드 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMainData();
  }, []);

  const fetchAllWeather = async () => {
    try {
      setIsWeatherLoading(true);
      const results = await Promise.allSettled(
        CITIES.map((city) =>
          axios.get(`${API_SERVER_URL}/community/weather?city=${city.code}`),
        ),
      );

      const nextMap = {};
      results.forEach((res, idx) => {
        const cityCode = CITIES[idx].code;
        if (res.status === "fulfilled" && res.value.data?.result) {
          nextMap[cityCode] = res.value.data.result;
        }
      });
      setWeatherMap(nextMap);
    } catch (err) {
      console.error("날씨 정보를 불러오지 못했습니다.", err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeather();
  }, []);

  const boardCards = [
    { key: "all", tabName: "전체게시판 추천글", list: mainData.all },
    ...mainData.tabs.map((tab) => ({
      key: tab.id,
      tabName: tab.tabName,
      list: mainData.byTab?.[tab.id] || [],
    })),
  ];

  return (
    <div className="comMain">
      <div className="comMain-wrap">
        <div className="comMain-top">
          <div className="comMain-top-con">
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
                className="comMain-banner-swiper"
              >
                <SwiperSlide>
                  <a href="/store">
                    <img src="" alt="커뮤니티 공지사항 배너 1" />
                  </a>
                </SwiperSlide>

                <SwiperSlide>
                  <a href="/store">
                    <img src="" alt="커뮤니티 메인 배너 2" />
                  </a>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>

        <div className="comMain-center">
          <div className="comMain-center-con">
            <div className="comMain-layout">
              {/* 왼쪽: 게시판 카드 그리드 */}
              <div className="comMain-board-grid">
                {isLoading ? (
                  <p className="comMain-loading">불러오는 중입니다</p>
                ) : (
                  boardCards.map((board) => (
                    <div className="board-card" key={board.key}>
                      <div className="board-card-header">
                        <h3>{board.tabName}</h3>
                      </div>
                      <div className="board-card-body">
                        {board.list.length === 0 ? (
                          <p className="board-card-empty">게시글이 없습니다</p>
                        ) : (
                          <ul>
                            {board.list.map((item) => (
                              <li key={item.id}>
                                <a href={`/community/detail/${item.id}`}>
                                  <p>{item.title}</p>
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 오른쪽: 날씨 + 운동루틴 */}
              <div className="comMain-side">
                <div className="board-card weather-card-wrap">
                  <div className="board-card-header">
                    <h3>지역별 날씨</h3>
                  </div>
                  <div className="board-card-body weather-card-body">
                    {isWeatherLoading ? (
                      <p className="board-card-empty">
                        날씨 정보를 불러오는 중...
                      </p>
                    ) : (
                      <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{ clickable: true }}
                        className="weather-swiper"
                      >
                        {CITIES.map((city) => {
                          const weather = weatherMap[city.code];
                          return (
                            <SwiperSlide key={city.code}>
                              <div className="weather-slide">
                                <div className="weather-slide-city">
                                  {city.label}
                                </div>
                                {weather ? (
                                  <>
                                    <img
                                      className="weather-slide-icon"
                                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                      alt={weather.weather[0].description}
                                    />
                                    <div className="weather-slide-temp">
                                      {Math.round(weather.main.temp)}°C
                                    </div>
                                    <div className="weather-slide-desc">
                                      {weather.weather[0].description}
                                    </div>
                                  </>
                                ) : (
                                  <div className="weather-slide-empty">
                                    정보 없음
                                  </div>
                                )}
                              </div>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    )}
                  </div>
                </div>

                <a
                  href="/community/routine"
                  className="board-card routine-card"
                >
                  <div className="board-card-header">
                    <h3>운동 루틴</h3>
                  </div>
                  <div className="board-card-body routine-card-body">
                    <img
                      className="routine-card-img"
                      src="/images/test/routine.png"
                      alt="운동 루틴 바로가기"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMain;
