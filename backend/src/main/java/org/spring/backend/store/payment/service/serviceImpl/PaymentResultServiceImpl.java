package org.spring.backend.store.payment.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentResultDto;
import org.spring.backend.store.payment.service.PaymentResultService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentResultServiceImpl implements PaymentResultService{
  
  @Override
  public PaymentResultDto dbInsert(PaymentResultDto dto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'dbInsert'");
  }

  @Override
  public List<PaymentResultDto> getList() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getList'");
  }
  
}
