package org.spring.backend.community.controller;

import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.service.CommunityService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RequiredArgsConstructor
@RestController
@RequestMapping("/community")
public class CommunityController {

  private final CommunityService communityService;

  @GetMapping({"","/","communityList"})
  public ResponseEntity<?> communityList(){
    Map<String, List<CommunityDto>> map = new HashMap<>();

    List<CommunityDto> communityList = communityService.communityList();
    map.put("result", communityList);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PostMapping("/insert")
  public ResponseEntity<?> communityInsert(@RequestBody CommunityDto communityDto) {
    Map<String, CommunityDto> map = new HashMap<>();
    //파일 여부 확인
    if (communityDto.getAttachFile()!=null&&!communityDto.getAttachFile().isEmpty()) {
      communityService.insertWithFile(communityDto);
    }else{
      communityService.insertWithOutFile(communityDto);
    }
    map.put("community", communityDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
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

}
