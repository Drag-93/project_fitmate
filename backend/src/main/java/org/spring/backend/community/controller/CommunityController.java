package org.spring.backend.community.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.spring.backend.common.service.WeatherService;
import org.spring.backend.community.dto.CategoryDto;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.dto.TabDto;
import org.spring.backend.community.service.CommunityService;
import org.spring.backend.community.service.TabService;
import org.spring.backend.member.jwt.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RequiredArgsConstructor
@RestController
@RequestMapping("/community")
@Slf4j
public class CommunityController {

  private final CommunityService communityService;
  private final TabService tabService;
  private final WeatherService weatherService;

  @GetMapping({"","/","/main"})
  public ResponseEntity<?> mainList() {
    Map<String, Object> data = communityService.mainList();

    Map<String, Object> map = new HashMap<>();
    map.put("result", data);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  //게시글 리스트
  @GetMapping("communityList")
  public ResponseEntity<?> communityList( @PageableDefault(size = 10, sort = "createTime", direction = Sort.Direction.DESC)Pageable pageable,
                                         @RequestParam(required = false) String subject,
                                         @RequestParam(required = false) String search){
    Map<String, Page<CommunityDto>> map = new HashMap<>();

    Page<CommunityDto> communityList = communityService.communityList(pageable, subject, search);
    map.put("result", communityList);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  //게시글 작성
  @PostMapping("/insert")
  public ResponseEntity<?> communityInsert(@RequestBody CommunityDto communityDto,Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요한 서비스입니다.");
    }
    CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
    String userEmail = customUserDetails.getMemberEntity().getUserEmail();


    Map<String, CommunityDto> map = new HashMap<>();
    communityService.communityInsert(communityDto, userEmail);
    map.put("community", communityDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  //게시글 삭제
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> communityDelete(@PathVariable("id") Long id,
                                           Authentication authentication){
    String userEmail = authentication.getName();
    communityService.communityDelete(id, userEmail);
    Map<String, String> map = new HashMap<>();
    map.put("result", "Delete");
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }
  @DeleteMapping("/adminDelete/{id}")
  public ResponseEntity<?> adminDelete(@PathVariable("id") Long id){
    communityService.adminDelete(id);
    Map<String, String> map = new HashMap<>();
    map.put("result", "Delete");
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  //게시글 수정
  @PutMapping("/update/{id}")
  public ResponseEntity<?> communityUpdate(@PathVariable("id") Long id,
                                           @RequestBody CommunityDto communityDto,
                                           Authentication authentication){
    // 컨트롤러가 받은 id를 서비스로 확실하게 전달합니다.
    String userEmail = authentication.getName();
    communityService.communityUpdate(id, communityDto, userEmail);
    
    Map<String, CommunityDto> map = new HashMap<>();
    map.put("result", communityDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
}

  @GetMapping("/detail/{id}")
  public ResponseEntity<?> communityDetail(
          @PathVariable("id") Long id,
          @RequestParam(value = "count", defaultValue = "false") boolean count, // 명시적 선언
          @AuthenticationPrincipal CustomUserDetails customUserDetails,
          HttpServletRequest request,
          HttpServletResponse response) {

    // 게시글 상세에 true, 댓글에 false
    if (count) {
      // 쿠키 확인 로직
      boolean isVisited = false;
      Cookie[] cookies = request.getCookies();
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          if (cookie.getName().equals("postView" + id)) {
            isVisited = true;
            break;
          }
        }
      }

      // 쿠키가 없으면 조회수 증가 및 쿠키 생성
      if (!isVisited) {
        communityService.updateHit(id);
        Cookie newCookie = new Cookie("postView" + id, "visited");
        newCookie.setMaxAge(60 * 60 * 24);
        response.addCookie(newCookie);
      }
    }

    // 2. 데이터 조회
    String userEmail = (customUserDetails != null) ? customUserDetails.getUsername() : null;
    CommunityDto communityDto = communityService.communityDetail(id, userEmail);

    Map<String, CommunityDto> map = new HashMap<>();
    map.put("community", communityDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  //탭 목록
  @GetMapping("tabList")
  public ResponseEntity<?> tabList(){
    Map<String, List<TabDto>> map = new HashMap<>();

    List<TabDto> tabDto = tabService.tabList();
    map.put("result", tabDto);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }
      
      //탭 상세보기 이동
      @GetMapping("tabList/{id}")
      public ResponseEntity<?> tabListDetail(@PathVariable("id") Long id){
        Map<String, List<TabDto>> map = new HashMap<>();
    
        List<TabDto> tabDto = tabService.tabList();
        map.put("result", tabDto);
    
        return ResponseEntity.status(HttpStatus.OK).body(map);
      }

      //카테고리 리스트 끌어오기
      @GetMapping("/category")
      public ResponseEntity<?> getCategoryList(){
        List<CategoryDto> categoryList = tabService.categoryList();
        Map<String , List<CategoryDto>> map = new HashMap<>();
        map.put("result", categoryList);
        return ResponseEntity.status(HttpStatus.OK).body(map);
      }

      @GetMapping("/tclist")
      public ResponseEntity<?> tcList(@RequestParam(value="tabId", required = false) Long tabId,
                                   @RequestParam(value = "categoryId", required = false) Long categoryId,
                                      @RequestParam(value="keyword", required = false) String keyword,
                                      @PageableDefault(size=10,sort = "createTime", direction = Sort.Direction.DESC) Pageable pageable){
        Page<CommunityDto> page = communityService.findCommunityList(tabId, categoryId, keyword, pageable);

        Map<String, Object> map = new HashMap<>();
        map.put("result", page);
        return ResponseEntity.status(HttpStatus.OK).body(map);
      }


        @GetMapping("/weather")
        public ResponseEntity<?> getWeather(@RequestParam("city") String city) {
          Map<String, Object> weatherResult = weatherService.getWeather(city);

          Map<String, Object> map = new HashMap<>();
          map.put("result", weatherResult);
          return ResponseEntity.status(HttpStatus.OK).body(map);
        }
    }
