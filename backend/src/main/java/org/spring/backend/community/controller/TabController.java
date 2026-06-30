package org.spring.backend.community.controller;

import org.spring.backend.community.dto.TabDto;
import org.spring.backend.community.service.TabService;
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
@RequestMapping("/tab")
public class TabController {

  private final TabService tabService;

  @GetMapping({"","/","tab"})
  public ResponseEntity<?> tabList(){
    Map<String, List<TabDto>> map = new HashMap<>();

    List<TabDto> tabDto = tabService.tabList();
    map.put("result", tabDto);

    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PostMapping("/insert")
  public ResponseEntity<?> tabInsert(@RequestBody TabDto tabDto) {
    tabService.insertTab(tabDto);
    Map<String, TabDto> map = new HashMap<>();
    
    map.put("tab", tabDto);
    return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> tabDelete(@PathVariable("id") Long id){
    
    tabService.tabDelete(id);
    Map<String, String> map = new HashMap<>();
    map.put("result", "Delete");
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

  @PutMapping("/update")
  public ResponseEntity<?> tabUpdate(@RequestBody TabDto tabDto){
        Map<String, TabDto> map = new HashMap<>();

    tabService.tabUpdate(tabDto);
    map.put("result", tabDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }
  @GetMapping("/detail/{id}")
  public ResponseEntity<?> tabDetail(@PathVariable("id") Long id){
        Map<String, TabDto> map = new HashMap<>();

    TabDto tabDto = tabService.tabDetail(id);
    map.put("tab", tabDto);
      return ResponseEntity.status(HttpStatus.OK).body(map);
  }

}
