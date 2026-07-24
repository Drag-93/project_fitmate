package org.spring.backend.common.weather.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.spring.backend.common.weather.service.WeatherService;
import org.spring.backend.common.weather.entity.WeatherEntity;
import org.spring.backend.common.weather.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherServiceImpl implements WeatherService {

    private final RestClient restClient;
    private final WeatherRepository weatherRepository;

    @Value("${openweather.api-key}")
    private String apiKey;

    @Value("${openweather.base-url}")
    private String baseUrl;

    private static final long CACHE_TTL_MINUTES = 120; // 2시간

    @Override
    public Map<String, Object> getWeather(String city) {
        return weatherRepository.findById(city)
                .filter(this::isFresh)
                .map(this::toResponseMap)
                .orElseGet(() -> fetchAndCache(city));
    }

    /** 스케줄러 전용 - TTL과 무관하게 무조건 최신으로 갱신 */
    public void forceRefresh(String city) {
        fetchAndCache(city);
    }

    private boolean isFresh(WeatherEntity entity) {
        return entity.getFetchTime() != null
                && entity.getFetchTime().isAfter(LocalDateTime.now().minusMinutes(CACHE_TTL_MINUTES));
    }

    private Map<String, Object> fetchAndCache(String city) {
        Map<String, Object> raw = callOpenWeather(city);

        if (raw != null) {
            SlimWeather slim = extractSlim(raw);
            weatherRepository.findById(city).ifPresentOrElse(
                    existing -> {
                        existing.update(slim.temp(), slim.icon(), slim.description(), LocalDateTime.now());
                        weatherRepository.save(existing);
                    },
                    () -> weatherRepository.save(
                            new WeatherEntity(city, slim.temp(), slim.icon(), slim.description(), LocalDateTime.now()))
            );
            return toResponseMap(slim);
        }

        // API 호출 실패 시, 오래된 캐시라도 있으면 그거라도 돌려준다
        log.warn("날씨 API 호출 실패, 캐시(있다면 오래된 것)로 폴백: city={}", city);
        return weatherRepository.findById(city)
                .map(this::toResponseMap)
                .orElse(null);
    }

    /** 프론트가 기대하는 { main: { temp }, weather: [{ icon, description }] } 형태로 재조립 */
    private Map<String, Object> toResponseMap(WeatherEntity entity) {
        return toResponseMap(new SlimWeather(entity.getTemp(), entity.getIcon(), entity.getDescription()));
    }

    private Map<String, Object> toResponseMap(SlimWeather slim) {
        return Map.of(
                "main", Map.of("temp", slim.temp()),
                "weather", List.of(Map.of(
                        "icon", slim.icon(),
                        "description", slim.description()
                ))
        );
    }

    @SuppressWarnings("unchecked")
    private SlimWeather extractSlim(Map<String, Object> raw) {
        Map<String, Object> mainMap = (Map<String, Object>) raw.get("main");
        List<Map<String, Object>> weatherList = (List<Map<String, Object>>) raw.get("weather");
        Map<String, Object> weatherFirst = (weatherList != null && !weatherList.isEmpty())
                ? weatherList.get(0) : Map.of();

        Double temp = (mainMap != null && mainMap.get("temp") instanceof Number n) ? n.doubleValue() : null;
        String icon = (String) weatherFirst.getOrDefault("icon", "");
        String description = (String) weatherFirst.getOrDefault("description", "");

        return new SlimWeather(temp, icon, description);
    }

    private Map<String, Object> callOpenWeather(String city) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("q", city)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .queryParam("lang", "kr")
                    .toUriString();

            return restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("날씨 조회 실패: city={}", city);
            return null;
        }
    }

    private record SlimWeather(Double temp, String icon, String description) {}
}