package org.spring.backend.admin.popup.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.popup.dto.PopupDto;
import org.spring.backend.admin.popup.service.PopupService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class PopupController {
    private final PopupService popupService;

    //=======================popup=======================
// 팝업 목록
//    @GetMapping("/popupList")
//    public ResponseEntity<?> popupList() {
//        Map<String, List<PopupDto>> map = new HashMap<>();
//
//        List<PopupDto> popupList = mainService.popupList();
//        map.put("result", popupList);
//
//        return ResponseEntity.ok(map);
//    }
    @GetMapping("/popupList")
    public ResponseEntity<?> popupList( @PageableDefault( page = 0,size = 5) Pageable pageable,
                                        @RequestParam( value = "status", required = false) String status,
                                        @RequestParam( value = "sortType", required = false) String sortType,
                                        @RequestParam( value = "search", required = false) String search) {
        Page<PopupDto> popupList =popupService.popupList( pageable, status, sortType, search);
        int currentPage = popupList.getNumber();
        int totalPage = popupList.getTotalPages();
        int blockNum = 5;

        // 현재 페이지가 속한 페이지 블록의 시작 번호
        int startPage = (currentPage / blockNum) * blockNum + 1;

        // 마지막 페이지 번호가 전체 페이지 수를 넘지 않도록 제한
        int endPage =Math.min(startPage + blockNum - 1, totalPage);

        Map<String, Object> response = new HashMap<>();

        response.put("popupList", popupList.getContent());
        response.put("currentPage", currentPage);
        response.put("totalPage", totalPage);
        response.put("startPage", startPage);
        response.put("endPage", endPage);
        response.put("totalElements", popupList.getTotalElements());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    // 팝업 등록
    @PostMapping(value = "/popupInsert",
            consumes = "multipart/form-data")
    public ResponseEntity<?> popupInsert(@ModelAttribute PopupDto popupDto) throws IOException {
        popupService.insertPopup(popupDto);

        return ResponseEntity.ok("ok");
    }

    // 팝업 삭제
    @DeleteMapping("/popupDelete/{popupId}")
    public ResponseEntity<?> popupDelete(@PathVariable Long popupId) throws IOException {
        popupService.deletePopup(popupId);

        return ResponseEntity.ok("ok");
    }

    // 팝업 수정
    @PutMapping(value = "/popupUpdate/{popupId}",
            consumes = "multipart/form-data")
    public ResponseEntity<?> popupUpdate(@PathVariable Long popupId,@ModelAttribute PopupDto popupDto) throws IOException {
        popupDto.setId(popupId);
        popupService.updatePopup(popupDto);

        return ResponseEntity.ok("ok");
    }
}
