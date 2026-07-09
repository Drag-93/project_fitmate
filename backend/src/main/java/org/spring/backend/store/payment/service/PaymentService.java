package org.spring.backend.store.payment.service;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.entity.PaymentEntity;

public interface PaymentService {

  void paymentInsert(PaymentDto paymentDto);

  // 마이페이지 결제조회
  List<PaymentDto> paymentListFn(Long memberId);

  // 관리자용 결제목록 조회
  List<PaymentDto> paymentAllList();

  // 단일 결제상세 조회
  PaymentDto findById(Long id);

  void paymentApproval(String pgToken, Long paymentId, Long productPrice, String productName, Long memberId);

  void paymentApproveKakao(PaymentEntity paymentEntity, String tid, Long productPrice, String productName,
      Long memberId);

  String getJsonDb();

  String pgRequest(String pg, Long productId, Long memberId, Long productPrice, String productName);

  String extractTidFromJson(String jsonString); 

  

}
