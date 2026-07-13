package org.spring.backend.store.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.spring.backend.member.jwt.CustomUserDetails;
import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.dto.PaymentResultDto;
import org.spring.backend.store.payment.service.PaymentResultService;
import org.spring.backend.store.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
  private final PaymentService paymentService;
  private final PaymentResultService paymentResultService;

  // 결제 등록
  @PostMapping
  public ResponseEntity<Void> paymentInsert(
      @RequestBody PaymentDto paymentDto) {

    paymentService.paymentInsert(paymentDto);
    return ResponseEntity.ok().build();
  }

  // 마이페이지 결제 목록
  @GetMapping("/member")
  public ResponseEntity<List<PaymentDto>> paymentList(
      @AuthenticationPrincipal CustomUserDetails user) {

    return ResponseEntity.ok(paymentService.paymentListFn(user.getMemberEntity().getId()));
  }

  // 관리자 결제 목록
  @GetMapping("/admin")
  public ResponseEntity<List<PaymentDto>> paymentAllList() {

    return ResponseEntity.ok(paymentService.paymentAllList());
  }

  // 결제 상세 조회
  @GetMapping("/{id}")
  public ResponseEntity<PaymentDto> paymentDetail(
      @PathVariable Long id) {

    return ResponseEntity.ok(paymentService.findById(id));
  }

  // 결제승인
  @GetMapping("approval/{paymentId}")
  public ResponseEntity<String> approval(
      @PathVariable(name = "paymentId") Long paymentId,
      @RequestParam("pg_token") String pgToken) {
    paymentService.paymentApproval(pgToken, paymentId);
    return ResponseEntity.ok("OK");
  }

  /*
   * productId, cartId, totalPrice, itemPrice, itemName,
   * return 으로 result pc 앱 결제 url 만 설정
   */
  @GetMapping("/{pg}/pg/{orderId}")
  public ResponseEntity<Map<String, Object>> pgRequest(
      @PathVariable("pg") String pg,
      @PathVariable(name = "orderId") Long orderId) {
    Map<String, Object> map = new HashMap<String, Object>();
    String approvalUrl = paymentService.pgRequest(pg, orderId);
    map.put("approvalUrl", approvalUrl);
    return ResponseEntity.ok(map);
  }

  @PostMapping("/fail")
  public Map<String, Object> fail(
      @RequestBody PaymentDto paymentDto,
      @RequestParam("memberid") String memberId) {

    return null;
  }

  @GetMapping("/db")
  public Map<String, Object> getDb() {
    Map<String, Object> map = new HashMap<String, Object>();
    String dbJsonData = paymentService.getJsonDb();

    System.out.println(dbJsonData + " <<< dbJsonData");
    System.out.println(paymentService.getJsonDb() + " <<< paymentService");

    map.put("kakaoDa", dbJsonData);

    return map;
  }

  @PostMapping("/insert")
  public Map<String, Object> dbInsert(@RequestBody PaymentResultDto dto) {

    System.out.println(dto + " .. dto");
    System.out.println(dto.getMemberId() + " .. dto");

    Map<String, Object> map = new HashMap<String, Object>();

    PaymentResultDto payResult = paymentResultService.dbInsert(dto);

    map.put("payResult", payResult);

    return map;
  }

  @GetMapping("/list")
  public Map<String, Object> getList() {

    Map<String, Object> map = new HashMap<String, Object>();

    List<PaymentResultDto> lists = paymentResultService.getList();

    map.put("payRsList", lists);

    return map;
  }
}