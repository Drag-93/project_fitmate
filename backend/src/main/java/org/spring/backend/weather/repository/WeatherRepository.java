package org.spring.backend.weather.repository;

import org.spring.backend.weather.entity.WeatherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherRepository extends JpaRepository<WeatherEntity, String> {
}
