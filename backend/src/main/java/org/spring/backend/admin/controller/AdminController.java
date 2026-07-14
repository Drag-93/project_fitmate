package org.spring.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.main.dto.PopupDto;
import org.spring.backend.main.service.MainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final MainService mainService;





    //=======================popup=======================
// 팝업 목록
    @GetMapping("/popupList")
    public ResponseEntity<?> popupList() {
        Map<String, List<PopupDto>> map = new HashMap<>();

        List<PopupDto> popupList = mainService.popupList();
        map.put("result", popupList);

        return ResponseEntity.ok(map);
    }

    // 팝업 등록
    @PostMapping(value = "/popupInsert",
            consumes = "multipart/form-data")
    public ResponseEntity<?> popupInsert(@ModelAttribute PopupDto popupDto) throws IOException {
        mainService.insertPopup(popupDto);

        return ResponseEntity.ok("ok");
    }

    // 팝업 삭제
    @DeleteMapping("/popupDelete/{popupId}")
    public ResponseEntity<?> popupDelete(@PathVariable Long popupId) throws IOException {
        mainService.deletePopup(popupId);

        return ResponseEntity.ok("ok");
    }

    // 팝업 수정
    @PutMapping(value = "/popupUpdate/{popupId}",
                consumes = "multipart/form-data")
    public ResponseEntity<?> popupUpdate(@PathVariable Long popupId,@ModelAttribute PopupDto popupDto) throws IOException {
        popupDto.setId(popupId);
        mainService.updatePopup(popupDto);

        return ResponseEntity.ok("ok");
    }
//=======================popup=======================
}
