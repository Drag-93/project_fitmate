package org.spring.backend.exercise;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * @PreAuthorize 등 메서드 단위 보안 어노테이션을 쓰려면 필요.
 * 이미 프로젝트의 SecurityConfig 등에 @EnableMethodSecurity가 있다면
 * 이 파일은 지워도 된다 (중복 선언 자체는 에러 아님).
 */
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}
