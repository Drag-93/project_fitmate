package org.spring.backend.member.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.spring.backend.common.Role;
import org.spring.backend.member.entity.RefreshEntity;
import org.spring.backend.member.repository.RefreshRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    //사용자 인증 처리 AuthenticationManager객체
    private final AuthenticationManager authenticationManager;
    //JWT토큰 생성 및 검증 유틸리티
    private final JWTUtil jwtUtil;
    //Refresh토큰 저장 레포지토리
    private final RefreshRepository refreshRepository;

    private final ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String userName = obtainUsername(request);
        String password = obtainPassword(request);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userName, password,
                null);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();


        String userEmail = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access",userEmail, role, 60 * 60 * 100L);
        String refresh = jwtUtil.createJwt("refresh",userEmail, role, 86400000L);

        //Refresh토큰 저장        addRefreshEntity(userEmail, refresh, 86400000L);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userEmail",userEmail);
        claims.put("role",role);
        claims.put("access",access);
        claims.put("refresh",refresh);

        String jsonStr = objectMapper.writeValueAsString(claims);
        response.setContentType("application/json");

        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }

    //Refresh토큰 DB서버에 저장
    private void addRefreshEntity(String userEmail, String refresh, Long expireMs){
        Date date = new Date(System.currentTimeMillis() + expireMs);

        RefreshEntity refreshEntity = RefreshEntity.builder()
                .userEmail(userEmail)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshEntity);
    }

    //인증 실패시
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(401);
    }
}


