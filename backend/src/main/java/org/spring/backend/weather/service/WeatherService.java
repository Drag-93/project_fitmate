package org.spring.backend.weather.service;

import java.util.Map;

public interface WeatherService {
    public Map<String, Object> getWeather(String city);
}
