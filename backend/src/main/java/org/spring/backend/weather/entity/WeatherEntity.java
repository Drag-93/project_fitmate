package org.spring.backend.common.weather.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "weather")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeatherEntity {
    @Id
    private String city;

    private Double temp;

    private String icon;

    private String description;

    private LocalDateTime fetchTime;


    public void update(Double temp, String icon, String description, LocalDateTime fetchTime){
        this.temp = temp;
        this.icon = icon;
        this.description = description;
        this.fetchTime=fetchTime;
    }
}
