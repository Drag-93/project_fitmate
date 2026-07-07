package org.spring.backend.community.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.community.dto.CommunityReplyDto;
import org.spring.backend.community.service.CommunityReplyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping("/reply")
public class CommunityReplyController {
    private final CommunityReplyService communityReplyService;

    //댓글 작성
    @PostMapping("/insert")
    public ResponseEntity<?> save(@RequestBody CommunityReplyDto dto){
        communityReplyService.insertReply(dto);
        Map<String, CommunityReplyDto> map = new HashMap<>();
        map.put("result", dto);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //댓글 목록 조회
    @GetMapping("/list/{communityId}")
    public ResponseEntity<?> list(@PathVariable("communityId") Long communityId){
        Map<String, List<CommunityReplyDto>> map = new HashMap<>();
        List<CommunityReplyDto> replyList = communityReplyService.replyList(communityId);
        map.put("result", replyList);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //댓글 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id")Long id){
        Map<String, CommunityReplyDto> map = new HashMap<>();
        CommunityReplyDto detail = communityReplyService.detailReply(id);
        map.put("result", detail);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }


    //댓글 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        Map<String , String> map = new HashMap<>();
        communityReplyService.deleteReply(id);
        map.put("result", "Delete");
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //댓글 수정
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody CommunityReplyDto dto){
        Map<String, CommunityReplyDto> map = new HashMap<>();
        communityReplyService.updateReply(id, dto);
        map.put("result", dto);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

}
