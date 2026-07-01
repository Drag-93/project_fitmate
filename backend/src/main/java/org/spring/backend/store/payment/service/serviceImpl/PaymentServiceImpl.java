package org.spring.backend.store.payment.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService{

  @Override
  public void paymentInsert(PaymentDto paymentDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'paymentInsert'");
  }

  @Override
  public List<PaymentDto> paymentListFn(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'paymentListFn'");
  }

  @Override
  public List<PaymentDto> paymentAllList() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'paymentAllList'");
  }

  @Override
  public PaymentDto findById(Long id) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'findById'");
  }
  
}
