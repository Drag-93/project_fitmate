package org.spring.backend.common.weather.repository;

import org.spring.backend.common.weather.entity.WeatherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherRepository extends JpaRepository<WeatherEntity, String> {
}
