import React from "react";
import { useEffect, useRef } from "react";
import axios from "axios";
import { API_SERVER_URL } from "../../../apis/commonApi";

const CommonMap = ({ width = "100%", height = "400px", level = 3 }) => {
  // 지도가 표시될 div
  const mapRef = useRef(null);
  // Kakao Map 객체
  const mapInstance = useRef(null);
  useEffect(() => {
    const loadMap = async () => {
      try {
        // backend에서 Kakao JavaScript Key 조회
        const res = await axios.get(`${API_SERVER_URL}/api/map/kakaoMap`);
        const kakaoKey = res.data.kakaoKey;

        // 이미 SDK가 로드되어 있으면 바로 지도 생성
        if (window.kakao && window.kakao.maps) {
          createMap();
          return;
        }
        // SDK 동적 로드
        const script = document.createElement("script");
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakaoKey}&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
          window.kakao.maps.load(() => {
            createMap();
          });
        };
      } catch (err) {
        console.error("카카오맵 로드 실패", err);
      }
    };

    // 지도 생성
    const createMap = () => {
      const container = mapRef.current;
      const options = {
        //테스트
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level,
      };

      mapInstance.current = new window.kakao.maps.Map(container, options);
    };
    loadMap();
  }, [level]);

  return (
    <div
      ref={mapRef}
      style={{
        width,
        height,
      }}
    />
  );
};

export default CommonMap;
