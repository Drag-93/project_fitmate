package org.spring.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.jwt.CustomLogoutFilter;
import org.spring.backend.member.jwt.JWTFilter;
import org.spring.backend.member.jwt.JWTUtil;
import org.spring.backend.member.jwt.LoginFilter;
import org.spring.backend.member.repository.RefreshRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JWTUtil jwtUtil;

    private final AuthenticationConfiguration authenticationConfiguration;

    private final RefreshRepository refreshRepository;

    private final ObjectMapper objectMapper;


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager)throws Exception{
        http.csrf(
                csrf -> csrf.disable()
                )
                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/member/login","/member/join").permitAll()
//                                .requestMatchers("/member/logout","/member/detail").authenticated()
//                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .anyRequest().permitAll())
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSoruce()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class) //기본 로그인 필터 이전에 실행
                .addFilterAt(new LoginFilter(authenticationManager, jwtUtil,
                        refreshRepository, objectMapper), UsernamePasswordAuthenticationFilter.class) //Spring 기본 로그인 필터대신 사용
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshRepository), LogoutFilter.class); //로그아웃 처리

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSoruce() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000", //react서버
                "http://localhost:8090", //백앤드 서버
                "http://online-payment.kakaopay.com" //카카오페이 결제 도메인
        ));
        configuration.setAllowedMethods(Arrays.asList("HEAD","GET","POST","PUT","DELETE","OPTIONS"));

        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Cache-Control",
                "Content-Type",
                "Set-Cookie",
                "access"
        ));

        configuration.setExposedHeaders(Arrays.asList("Authorization","access","Set-Cookie"));

        configuration.setAllowCredentials(true);

        //Cors응답 캐싱시간 지정
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration); //모든 API 엔드포인트 적용
        return source;
    }

}
