package org.spring.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.community.dto.TabDto;
import org.spring.backend.community.service.TabService;
import org.spring.backend.admin.popup.dto.PopupDto;
import org.spring.backend.admin.popup.service.PopupService;
import org.spring.backend.store.order.dto.OrderDto;
import org.spring.backend.store.order.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
    private final TabService tabService;
    private final PopupService popupService;
    private final OrderService orderService;



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
    public ResponseEntity<?> popupList(@PageableDefault(page = 0, size = 5, sort="id",
                                                direction = Sort.Direction.ASC) Pageable pageable,
                                        @RequestParam(value = "subject",required = false)String subject,
                                        @RequestParam(value = "search", required = false)String search){
        Page<PopupDto> popupList = popupService.popupList(pageable, subject, search);

        int newPage = popupList.getNumber(); //현재페이지
        int totalPage = popupList.getTotalPages(); //전체페이지
        int blockNum = 5; //한페이지에 보여질 페이지넘버의 수

        //블록 시작
        int startPage = (newPage / blockNum) * blockNum + 1; //시작페이지
        //블록 끝
        int endPage = Math.min(startPage+blockNum-1, totalPage); //끝페이지
        Map<String, Object> response = new HashMap<>();
        response.put("popupList", popupList.getContent());
        response.put("currentPage", newPage);
        response.put("totalPage", totalPage);
        response.put("startPage", startPage);
        response.put("totalElements", popupList.getTotalElements());
        response.put("endPage", endPage);
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
//=======================popup=======================


    // 탭생성
    @PostMapping("/tabInsert")
    public ResponseEntity<?> tabInsert(@RequestBody List<TabDto> tabDto) {
        tabService.insertTab(tabDto);
        Map<String, List<TabDto>> map = new HashMap<>();

        map.put("tab", tabDto);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //탭 삭제
    @DeleteMapping("/tabDelete/{id}")
    public ResponseEntity<?> tabDelete(@PathVariable("id") Long id){

        tabService.tabDelete(id);
        Map<String, String> map = new HashMap<>();
        map.put("result", "Delete");
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //탭 수정
    @PutMapping("/tabUpdate/{id}")
    public ResponseEntity<?> tabUpdate(@PathVariable("id") Long id, @RequestBody TabDto tabDto){
        tabDto.setId(id);
        Map<String, TabDto> map = new HashMap<>();

        tabService.tabUpdate(tabDto);
        map.put("result", tabDto);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //탭 상세 //
    @GetMapping("/tabDetail/{id}")
    public ResponseEntity<?> tabDetail(@PathVariable("id") Long id){
        Map<String, TabDto> map = new HashMap<>();

        TabDto tabDto = tabService.tabDetail(id);
        map.put("tab", tabDto);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    // 관리자 주문 전체 조회
    @GetMapping("/orderList")
    public ResponseEntity<List<OrderDto>> orderList() {

        return ResponseEntity.ok(
                orderService.adminOrderList()
        );

}
}
