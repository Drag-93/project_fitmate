package org.spring.backend.store.subscription.service.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.payment.repository.PaymentRepository;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.subscription.dto.SubscriptionDto;
import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.spring.backend.store.subscription.repository.SubscriptionRepository;
import org.spring.backend.store.subscription.service.SubscriptionService;
import org.spring.backend.store.subscription.type.SubscriptionStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionServiceImpl implements SubscriptionService {

  private final SubscriptionRepository subscriptionRepository;
  private final MemberRepository memberRepository;
  private final ProductRepository productRepository;
  private final PaymentRepository paymentRepository;

  @Override
  public void insertSubscription(Long memberId, Long productId, SubscriptionDto subscriptionDto) {
    MemberEntity memberEntity = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

    ProductEntity product = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    SubscriptionEntity subscriptionEntity = SubscriptionEntity.builder()
        .memberEntity(memberEntity)
        .productEntity(product)
        .subscriptionStatus(SubscriptionStatus.ACTIVE)
        .nextPaymentDate(
            subscriptionDto.getNextPaymentDate() != null
                ? subscriptionDto.getNextPaymentDate()
                : LocalDateTime.now().plusMonths(1))
        .build();

    subscriptionRepository.save(subscriptionEntity);
  }

  @Override
  @Transactional(readOnly = true)
  public List<SubscriptionDto> subscriptionList(Long memberId) {
    return subscriptionRepository.findByMemberEntity_Id(memberId)
        .stream()
        .map(SubscriptionDto::toSubscriptionDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public SubscriptionDto subscriptionDetail(Long subscriptionId) {

    SubscriptionEntity subscription = subscriptionRepository.findById(subscriptionId)
        .orElseThrow(() -> new IllegalArgumentException("구독 상품이 존재하지 않습니다."));

    return SubscriptionDto.toSubscriptionDto(subscription);
  }

  @Override
  public void updateSubscriptionStatus(Long subscriptionId, SubscriptionDto subscriptionDto) {

    SubscriptionEntity subscription = subscriptionRepository.findById(subscriptionId)
        .orElseThrow(() -> new IllegalArgumentException("구독 상품이 존재하지 않습니다."));

    subscription.setSubscriptionStatus(subscriptionDto.getSubscriptionStatus());
  }

  @Override
  public void cancelSubscription(Long subscriptionId) {
    SubscriptionEntity subscription = subscriptionRepository.findById(subscriptionId)
        .orElseThrow(() -> new IllegalArgumentException("구독 상품이 존재하지 않습니다."));

    subscription.setSubscriptionStatus(SubscriptionStatus.CANCELED);
    subscription.setNextPaymentDate(null);
    subscription.setEndDate(LocalDateTime.now());
  }

  @Override
  public void updateNextPaymentDate(Long subscriptionId) {

    SubscriptionEntity subscription = subscriptionRepository.findById(subscriptionId)
        .orElseThrow(() -> new IllegalArgumentException("구독 상품이 존재하지 않습니다."));

    // 예: 1달 후 자동 갱신
    subscription.setNextPaymentDate(
        subscription.getNextPaymentDate() != null
            ? subscription.getNextPaymentDate().plusMonths(1)
            : LocalDateTime.now().plusMonths(1));
  }

}
