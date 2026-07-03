package org.spring.backend.store.payment.controller;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
  private final PaymentService paymentService;

  // 결제 등록
  @PostMapping
  public ResponseEntity<Void> paymentInsert(
      @RequestBody PaymentDto paymentDto) {

    paymentService.paymentInsert(paymentDto);
    return ResponseEntity.ok().build();
  }

  // 마이페이지 결제 목록
  @GetMapping("/member/{memberId}")
  public ResponseEntity<List<PaymentDto>> paymentList(
      @PathVariable Long memberId) {

    return ResponseEntity.ok(paymentService.paymentListFn(memberId));
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
}