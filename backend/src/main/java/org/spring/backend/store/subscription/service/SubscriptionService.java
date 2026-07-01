package org.spring.backend.store.subscription.service;

import java.util.List;

import org.spring.backend.store.subscription.dto.SubscriptionDto;

public interface SubscriptionService {
      // 구독 생성 (구독 시작)
    void insertSubscription(Long memberId, Long productId, SubscriptionDto subscriptionDto);

    // 내 구독 목록
    List<SubscriptionDto> subscriptionList(Long memberId);

    // 구독 상세
    SubscriptionDto subscriptionDetail(Long subscriptionId);

    // 구독 상태 변경 (ACTIVE / CANCEL / PAUSED 등)
    void updateSubscriptionStatus(Long subscriptionId, SubscriptionDto subscriptionDto);

    // 구독 취소
    void cancelSubscription(Long subscriptionId);

    // 다음 결제일 갱신 (자동결제용)
    void updateNextPaymentDate(Long subscriptionId);
}
