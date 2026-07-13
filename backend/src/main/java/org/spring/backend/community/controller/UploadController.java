package org.spring.backend.community.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/upload")
@Slf4j
public class UploadController {

    // 기존 WebConfig에서 쓰는 communityPath와 동일한 프로퍼티 키를 사용
    // (WebConfig의 "/upload/community/**" 매핑과 실제 저장 경로를 반드시 일치시켜야 함)
    @Value("${img.path.community}")
    private String communityPath;

    // 기존 WebConfig가 매핑하는 URL 프리픽스와 동일하게 맞춤
    private static final String URL_PREFIX = "/upload/community/";

    @PostMapping("/image")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일이 비어 있습니다."));
        }

        try {
            String uploadDir = ensureTrailingSlash(stripFilePrefix(communityPath));

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String newFileName = UUID.randomUUID() + "-" + originalFilename;

            File destination = new File(uploadDir, newFileName);
            file.transferTo(destination);

            String imageUrl = URL_PREFIX + newFileName;

            log.info("이미지 업로드 성공: {}", imageUrl);
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (IOException e) {
            log.error("이미지 업로드 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "이미지 업로드 중 오류가 발생했습니다."));
        }
    }

    // 기존 WebConfig에 있는 ensureTrailingSlash와 동일한 로직
    // (같은 유틸이 이미 있다면 그걸 재사용하고 이 메서드는 지워도 됨)
    private String ensureTrailingSlash(String path) {
        if (path == null || path.isEmpty()) return path;
        return path.endsWith("/") || path.endsWith("\\") ? path : path + "/";
    }

    // application.properties에 "file:E:/..." 처럼 Spring 리소스 프로토콜 접두사가
    // 붙어 있는 경우, new File()에 그대로 넣으면 안 되므로 제거해야 함
    private String stripFilePrefix(String path) {
        if (path == null) return null;
        if (path.startsWith("file:///")) return path.substring(8);
        if (path.startsWith("file://")) return path.substring(7);
        if (path.startsWith("file:")) return path.substring(5);
        return path;
    }
}