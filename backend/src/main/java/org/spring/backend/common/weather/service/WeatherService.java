package org.spring.backend.common.weather.service;

import java.util.Map;

public interface WeatherService {
    public Map<String, Object> getWeather(String city);
}
