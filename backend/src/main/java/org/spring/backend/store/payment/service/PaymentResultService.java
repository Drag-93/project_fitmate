package org.spring.backend.store.payment.service;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentResultDto;

public interface PaymentResultService {
  
  PaymentResultDto dbInsert(PaymentResultDto dto);

  List<PaymentResultDto> getList();





}
