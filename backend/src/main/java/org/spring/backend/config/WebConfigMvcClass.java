package org.spring.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigMvcClass implements WebMvcConfigurer {
    //각자 사용하는 이미지별 경로 주입
    @Value("${img.path.member}")
    private String memberPath;

    @Value("${img.path.product}")
    private String itemPath;

    @Value("${img.path.community}")
    private String communityPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        //각각 사용하는 파일 경로 변환
        String memberLoc = ensureTrailingSlash(memberPath);
        String itemLoc = itemPath;
        String communityLoc = ensureTrailingSlash(communityPath);

        // 멤버 프로필 이미지 경로 매핑
        registry.addResourceHandler("/upload/member/**")
                .addResourceLocations(memberLoc);

        // 아이템 이미지 경로 매핑
        registry.addResourceHandler("/upload/product/**")
                .addResourceLocations(itemLoc);

        // 커뮤니티 이미지 경로 매핑
        registry.addResourceHandler("/upload/community/**")
                .addResourceLocations(communityLoc);
    }
    //경로 끝에 / 경로로 변경해주고, 윈도우 프로토콜 형식을 맞춰주는 메서드
    private String ensureTrailingSlash(String path) {
        if (path == null) return "";

        // 만약 file: 로 시작하지 않는다면 붙여줌
        if (!path.startsWith("file:")) {
            path = "file:" + path;
        }

        // 윈도우기준 포맷인 file:/E:/.../ 구조로 통일 (슬래시 1개)
        path = path.replace("file://", "file:/");
        path = path.replace("file:///", "file:/");

        // 맨 끝에 슬래시가 없다면 붙여줌
        if (!path.endsWith("/")) {
            path = path + "/";
        }
        return path;
    }
}
