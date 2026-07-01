package org.spring.backend.member.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.repository.RefreshRepository;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws IOException, ServletException{
        String requestUri = request.getRequestURI();
        //로그아웃이 아닐때
        if(!requestUri.matches("^\\/logout$")){
            chain.doFilter(request,response);
            return;
        }
        String requestMethod = request.getMethod();
        //request 메소드가 POST가 아닐때
        if(!requestMethod.equals("POST")){
            chain.doFilter(request,response);
            return;
        }

        //Refresh토큰 가져오기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie: cookies){
            //쿠키중 refresh이름이 달린 쿠키 찾기
            if(cookie.getName().equals("refresh")){
                refresh = cookie.getValue();
            }
        }

        //Refresh토큰 유효성 검사
        if(refresh == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //유효기간 만료 검사
        try{
            jwtUtil.isExpired(refresh);
        }catch (ExpiredJwtException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        //토큰카테고리가 refresh인지 확인(이름만 refresh인것을 걸러내기 위함)
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("refresh")){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //Refresh테이블에 저장되어있는지 확인
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        if(!isExist){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //Refresh토큰 DB에서 제거
        refreshRepository.deleteByRefresh(refresh);

        //Refresh 토큰 Cookie값 초기화
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
