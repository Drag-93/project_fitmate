import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { API_SERVER_URL } from "../../apis/commonApi";
import "../css/Community/CommunityMain.css";
import jwtAxios from "../../apis/util/jwtUtil";

//날씨 지역 목록
const CITIES = [
  { code: "Seoul", label: "서울" }, //서울
  { code: "Suwon", label: "수원" }, //경기
  { code: "Cheonan", label: "천안" }, //충남
  { code: "Cheongju", label: "청주" }, //충북
  { code: "Jeonju", label: "전주" }, //전북
  { code: "Gwangju", label: "광주" }, //전남
  { code: "Pohang", label: "포항" }, //경북
  { code: "Changwon", label: "창원" }, //경남
  { code: "Chuncheon", label: "춘천" }, //강원
  { code: "Jeju", label: "제주" }, //제주
];

//운동추천
const getExerciseRecommendation = (weather) => {
  if (!weather) {
    return {
      title: "날씨 정보를 불러오는 중",
      desc: "잠시 후 추천 운동이 표시됩니다",
    };
  }

  const temp = weather.main?.temp;
  const main = weather.weather?.[0]?.main;
  const rainLike = ["Rain", "Thunderstorm", "Drizzle", "Snow"]; // 비 눈 등

  if (rainLike.includes(main)) {
    //비나 눈일때
    return {
      title: "실내 클라이밍 / 홈트레이닝 추천",
      desc: "비/눈 소식이 있어요. 실내 클라이밍이나 홈트레이닝을 추천드려요",
    };
  }
  if (temp >= 28) {
    //온도가 28 이상
    return {
      title: "수영 / 실내 운동 추천",
      desc: "더운 날씨예요. 수영이나 실내 운동으로 더위를 피하세요.",
    };
  }
  if (temp <= 5) {
    // 온도 5 이하
    return {
      title: "실내 유산소 / 웨이트 트레이닝 추천",
      desc: "추운 날씨예요. 실내 유산소, 웨이트 트레이닝으로 추위를 피하세요.",
    };
  }
  return {
    //이외
    title: "야외 러닝 / 등산 추천",
    desc: "야외에서 운동하기 좋은 날씨예요. 가벼운 러닝이나 등산을 추천드려요.",
  };
};

const CommunityMain = () => {
  const [mainData, setMainData] = useState({
    byTab: {},
    all: [],
    tabs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const [weatherMap, setWeatherMap] = useState({});
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Seoul");

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

  //지역별 날씨 불러오기
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

  const selectedWeather = weatherMap[selectedCity];

  const recommendation = useMemo(
    () => getExerciseRecommendation(selectedWeather),
    [selectedWeather],
  );

  const EXCLUDED_CATEGORY_KEYWORDS = ["QNA"]; //추가로 제외할 카테고리 이름
  const boardCards = [
    {
      key: "all",
      tabName: "전체게시판 추천글",
      list: mainData.all.filter((item) => {
        const tab = mainData.tabs.find((t) => t.id === item.tabId);
        // 공지사항(adminOnly) 탭 제외
        if (tab?.adminOnly) return false;
        // 카테고리명에 지정한 이름 포함되어 있으면 제외
        const categoryName = item.categoryName || "";
        const isExcluded = EXCLUDED_CATEGORY_KEYWORDS.some((keyword) =>
          categoryName.toUpperCase().includes(keyword.toUpperCase()),
        );
        if (isExcluded) return false;
        return true;
      }),
    },
    ...mainData.tabs.map((tab) => ({
      key: tab.id,
      tabName: tab.tabName,
      list: mainData.byTab?.[tab.id] || [],
    })),
  ];

  return (
    <div className="comMain">
      <div className="comMain-wrap">
        {/* 배너 자리 -> 날씨 + 추천운동 + 운동루틴 */}
        <div className="comMain-top">
          <div className="comMain-top-con comMain-top-row">
            {/* 지역별 날씨 */}
            <div className="board-card weather-card-wrap">
              <div className="board-card-header weather-card-header">
                <h3>지역별 날씨</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="weather-city-select"
                >
                  {CITIES.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="board-card-body weather-card-body">
                {isWeatherLoading ? (
                  <p className="board-card-empty">날씨 정보를 불러오는 중...</p>
                ) : selectedWeather ? (
                  <div className="weather-slide">
                    <div className="weather-slide-city">
                      {CITIES.find((c) => c.code === selectedCity)?.label}
                    </div>
                    <img
                      className="weather-slide-icon"
                      src={`https://openweathermap.org/img/wn/${selectedWeather.weather[0].icon}@2x.png`}
                      alt={selectedWeather.weather[0].description}
                    />
                    <div className="weather-slide-temp">
                      {Math.round(selectedWeather.main.temp)}°C
                    </div>
                    <div className="weather-slide-desc">
                      {selectedWeather.weather[0].description}
                    </div>
                  </div>
                ) : (
                  <div className="weather-slide-empty">정보 없음</div>
                )}
              </div>
            </div>

            {/* 날씨 기반 추천 운동 */}
            <div className="board-card recommend-card">
              <div className="board-card-header">
                <h3>오늘의 추천 운동</h3>
              </div>
              <div className="board-card-body recommend-card-body">
                <p className="recommend-title">{recommendation.title}</p>
                <p className="recommend-desc">{recommendation.desc}</p>
              </div>
            </div>

            {/* 운동 루틴 이동 */}
            <a href="/community/routine" className="board-card routine-card">
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

        {/* 게시판 카드 그리드 (전체 너비) */}
        <div className="comMain-center">
          <div className="comMain-center-con">
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
                              <a
                                href={`/community/detail/${item.id}`}
                                className="board-item"
                              >
                                {item.thumbnail ? (
                                  <img
                                    className="board-item-thumb"
                                    src={item.thumbnail}
                                    alt=""
                                  />
                                ) : (
                                  <div className="board-item-thumb board-item-thumb-empty" />
                                )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMain;
