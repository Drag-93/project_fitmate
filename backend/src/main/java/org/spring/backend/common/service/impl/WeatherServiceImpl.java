package org.spring.backend.common.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.spring.backend.common.service.WeatherService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.Map;
@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherServiceImpl implements WeatherService {

    private final RestClient restClient;

    @Value("${openweather.api-key}")
    private String apiKey;

    @Value("${openweather.base-url}")
    private String baseUrl;

    @Override
    public Map<String, Object> getWeather(String city) {
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
}