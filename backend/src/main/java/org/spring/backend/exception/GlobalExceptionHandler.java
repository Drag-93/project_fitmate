package org.spring.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

//AI가 정리해준 RestAPI별 에러 정리
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("클라이언트 요청 오류: {}", e.getMessage());

        // 프론트엔드 인터셉터나 catch문에서 알 수 있도록 400 에러와 메시지 반환
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST) // 400 Bad Request
                .body(e.getMessage());
    }

    // 2. Redis 서버 다운 등 인프라 및 시스템 장애 (Server Error)
    @ExceptionHandler(value = IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        log.error("서버 내부 시스템 오류: {}", e.getMessage());

        // Redis 서버 연결 오류 등은 서버 문제이므로 500 에러 반환
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                .body(e.getMessage());
    }

    // 3. 그 외 예측하지 못한 모든 기타 예외 처리
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<String> handleAllException(Exception e) {
        log.error("예상치 못한 예외 발생: ", e);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                .body("서버 내부 오류가 발생했습니다.");
    }
}
