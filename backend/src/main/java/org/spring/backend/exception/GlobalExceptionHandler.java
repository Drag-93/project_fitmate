package org.spring.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GlobalExceptionHandler {
    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<?> illegalArgumentException(IllegalArgumentException e){
        String html="<script>"+
                "alert('"+e.getMessage()+"')"+
                "history.go(-1)"+
                "</script>";
     return ResponseEntity.status(HttpStatus.BAD_REQUEST)
             .header("Content-Type","text/html; charset=UTF-8") // 'return type = 문서'
             .body(html)   ;
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<?> illegalStateException(IllegalStateException e){
        String html="<script>"+
                "alert('"+e.getMessage()+"')"+
                "history.go(-1)"+
                "</script>";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .header("Content-Type","text/html; charset=UTF-8") // 'return type = 문서'
                .body(html)   ;
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<?> allException(Exception e){
        String html="<script>"+
                "alert('"+e.getMessage()+"')"+
                "history.go(-1)"+
                "</script>";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .header("Content-Type","text/html; charset=UTF-8") // 'return type = 문서'
                .body(html)   ;
    }
}
