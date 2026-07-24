package org.spring.backend.weather.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.spring.backend.weather.service.impl.WeatherServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * CommunityMain.jsx에서 쓰는 도시를 1시간마다 미리 갱신해둔다.
 * ⚠️ 이 목록은 프론트 CITIES 배열의 code 값과 반드시 동일하게 유지할 것.
 * 새 도시를 추가/삭제하면 여기도 같이 수정해야 함.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WeatherScheduler {

    // WeatherService 인터페이스가 아니라 구현체를 직접 주입 - forceRefresh가
    // 인터페이스에는 없는 스케줄러 전용 메서드라서. 인터페이스도 수정 가능하면
    // 그쪽에 refreshWeather(String) 등으로 정식 노출하는 게 더 깔끔할 수 있음.
    private final WeatherServiceImpl weatherService;

    private static final List<String> CITY_CODES = List.of(
            "Seoul", "Suwon", "Cheonan", "Cheongju", "Jeonju",
            "Gwangju", "Pohang", "Changwon", "Chuncheon", "Jeju"
    );

    /** 매 정시(1:00, 2:00, 3:00 ...)에 실행 */
    @Scheduled(cron = "0 0 * * * *")
    public void refreshAllCities() {
        log.info("날씨 캐시 갱신 시작: {}개 도시", CITY_CODES.size());
        for (String city : CITY_CODES) {
            try {
                weatherService.forceRefresh(city);
            } catch (Exception e) {
                log.warn("날씨 갱신 실패: city={}", city, e);
            }
        }
        log.info("날씨 캐시 갱신 완료");
    }
}