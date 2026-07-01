package org.spring.backend.store.payment.service;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentDto;

public interface PaymentService {
  
  void paymentInsert(PaymentDto paymentDto);

  List<PaymentDto> paymentListFn(Long memberId);

  List<PaymentDto> paymentAllList();

  PaymentDto findById(Long id);
}
