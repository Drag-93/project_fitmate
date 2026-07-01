package org.spring.backend.store.subscription.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.subscription.dto.SubscriptionDto;
import org.spring.backend.store.subscription.service.SubscriptionService;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

  @Override
  public void insertSubscription(Long memberId, Long productId, SubscriptionDto subscriptionDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertSubscription'");
  }

  @Override
  public List<SubscriptionDto> subscriptionList(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'subscriptionList'");
  }

  @Override
  public SubscriptionDto subscriptionDetail(Long subscriptionId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'subscriptionDetail'");
  }

  @Override
  public void updateSubscriptionStatus(Long subscriptionId, SubscriptionDto subscriptionDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateSubscriptionStatus'");
  }

  @Override
  public void cancelSubscription(Long subscriptionId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'cancelSubscription'");
  }

  @Override
  public void updateNextPaymentDate(Long subscriptionId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateNextPaymentDate'");
  }
  
}
