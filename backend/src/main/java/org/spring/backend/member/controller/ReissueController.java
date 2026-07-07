package org.spring.backend.member.controller;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.entity.RefreshEntity;
import org.spring.backend.member.jwt.JWTUtil;
import org.spring.backend.member.repository.RefreshRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequiredArgsConstructor
public class ReissueController {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    @PostMapping("/reissue")
    @Transactional
    public ResponseEntity<?> reissue(HttpServletRequest request,
                                     HttpServletResponse response){
        //Refresh토큰 가져오기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                //쿠키중 refresh이름이 달린 쿠키 찾기
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }
        }

        //Refresh토큰 유효성 검사
        if(refresh == null){
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }
        //유효기간 만료 검사
        try{
            jwtUtil.isExpired(refresh);
        }catch (ExpiredJwtException e){
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }
        //토큰카테고리가 refresh인지 확인(이름만 refresh인것을 걸러내기 위함)
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("refresh")){
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        //Refresh테이블에 저장되어있는지 확인
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        if(!isExist){
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String userEmail = jwtUtil.getUserEmail(refresh);
        String role = jwtUtil.getRole(refresh);

        //토큰생성
        String newAccess = jwtUtil.createJwt("access",userEmail, role, 60* 60 *100L);
        String newRefresh = jwtUtil.createJwt("refresh",userEmail,role,84600000L);
        //Refresh 토큰 저장, 기존의 Refresh토큰이 있었다면 제거 후 새 Refresh토큰으로 저장
        try {
            refreshRepository.deleteByRefresh(refresh);
            refreshRepository.flush();
        } catch (Exception e) {
            System.out.println("이미 다른 요청에 의해 삭제된 토큰입니다: " + e.getMessage());
        }
        addRefreshEntity(userEmail, newRefresh, 86400000L);

        response.setHeader("access",newAccess);
        response.addCookie(createCookie("refresh", newRefresh));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void addRefreshEntity(String userEmail, String refresh, Long expiredMs){
        
        Date date = new Date(System.currentTimeMillis() + expiredMs);
        RefreshEntity refreshEntity = RefreshEntity.builder()
                .userEmail(userEmail)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshEntity);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        return cookie;
    }
}
