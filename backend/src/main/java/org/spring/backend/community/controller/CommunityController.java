package org.spring.backend.community.controller;

import org.springframework.http.MediaType;
import org.spring.backend.community.dto.CategoryDto;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.dto.TabDto;
import org.spring.backend.community.service.CommunityService;
import org.spring.backend.community.service.TabService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

  @GetMapping({"","/","communityList"})
  public ResponseEntity<?> communityList(){
    Map<String, List<CommunityDto>> map = new HashMap<>();

    List<CommunityDto> communityList = communityService.communityList();
    map.put("result", communityList);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  // @PostMapping("/insert")
  // public ResponseEntity<?> communityInsert(@RequestBody CommunityDto communityDto) {
  //   Map<String, CommunityDto> map = new HashMap<>();
  //   communityService.communityInsert(communityDto);
  //   map.put("community", communityDto);
  //   return ResponseEntity.status(HttpStatus.OK).body(map);
  // }

  @PostMapping(value = "/insert", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
public ResponseEntity<?> communityInsert(
        @RequestPart("data") CommunityDto communityDto, // JSON 데이터
        @RequestPart(value = "file", required = false) MultipartFile file) { // 파일
    
    // 파일이 있다면 DTO에 넣어주기
    if (file != null && !file.isEmpty()) {
        communityDto.setAttachFile(file);
    }
    
    communityService.communityInsert(communityDto);
    return ResponseEntity.ok("작성 성공");
}

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> communityDelete(@PathVariable("id") Long id){
    
    communityService.communityDelete(id);
    Map<String, String> map = new HashMap<>();
    map.put("result", "Delete");
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PutMapping("/update")
  public ResponseEntity<?> communityUpdate(@RequestBody CommunityDto communityDto){
        Map<String, CommunityDto> map = new HashMap<>();

    communityService.communityUpdate(communityDto);
    map.put("result", communityDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }
  @GetMapping("/detail/{id}")
  public ResponseEntity<?> communityDetail(@PathVariable("id") Long id){
        Map<String, CommunityDto> map = new HashMap<>();

    CommunityDto communityDto = communityService.communityDetail(id);
    map.put("community", communityDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

    @GetMapping("tabList")
  public ResponseEntity<?> tabList(){
    Map<String, List<TabDto>> map = new HashMap<>();

    List<TabDto> tabDto = tabService.tabList();
    map.put("result", tabDto);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @GetMapping("tabList/{id}")
  public ResponseEntity<?> tabListDetail(@PathVariable("id") Long id){
    Map<String, List<TabDto>> map = new HashMap<>();

    List<TabDto> tabDto = tabService.tabList();
    map.put("result", tabDto);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PostMapping("/tabInsert")
  public ResponseEntity<?> tabInsert(@RequestBody List<TabDto> tabDto) {
    tabService.insertTab(tabDto);
    Map<String, List<TabDto>> map = new HashMap<>();
    
    map.put("tab", tabDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @DeleteMapping("/tabDelete/{id}")
  public ResponseEntity<?> tabDelete(@PathVariable("id") Long id){
    
    tabService.tabDelete(id);
    Map<String, String> map = new HashMap<>();
    map.put("result", "Delete");
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PutMapping("/tabUpdate")
  public ResponseEntity<?> tabUpdate(@RequestBody TabDto tabDto){
        Map<String, TabDto> map = new HashMap<>();

    tabService.tabUpdate(tabDto);
    map.put("result", tabDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }
  @GetMapping("/tabDetail/{id}")
  public ResponseEntity<?> tabDetail(@PathVariable("id") Long id){
        Map<String, TabDto> map = new HashMap<>();

    TabDto tabDto = tabService.tabDetail(id);
    map.put("tab", tabDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @GetMapping("/category")
  public ResponseEntity<?> getCategory(){
    List<CategoryDto> categoryList = tabService.categoryList();
    Map<String , List<CategoryDto>> map = new HashMap<>();
    map.put("result", categoryList);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @GetMapping("/list")
  public ResponseEntity<?> getList(@RequestParam(value="tabId", required = false) Long tabId,
                                   @RequestParam(value = "categoryId", required = false) Long categoryId){
    List<CommunityDto> list;
    if (categoryId != null){
      list = communityService.findByCategory(categoryId);
    }else if(tabId!=null){
      list = communityService.findByTab(tabId);
    } else{
      list = communityService.communityList();
    }
    Map<String, Object> map = new HashMap<>();
    map.put("result", list);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }
}
