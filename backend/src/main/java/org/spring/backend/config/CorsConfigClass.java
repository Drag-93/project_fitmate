package org.spring.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfigClass implements WebMvcConfigurer{

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
    .allowedOrigins(
    "http://localhost:3000",
    "http://localhost:8090",
    "http://online-payment.kakapay.com"
    )
    .allowedMethods("POST","PUT","GET","DELETE","HEAD","OPTION")
    .allowedHeaders("*")
    .allowCredentials(false)
    .maxAge(300);
  }
}