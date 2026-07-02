package org.spring.backend.store.payment.service;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentDto;

public interface PaymentService {
  
  void paymentInsert(PaymentDto paymentDto);

  //마이페이지 결제조회
  List<PaymentDto> paymentListFn(Long memberId);

  //관리자용 결제목록 조회
  List<PaymentDto> paymentAllList();

  // 단일 결제상세 조회
  PaymentDto findById(Long id);
}
