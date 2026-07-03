package org.spring.backend.store.subscription.controller;

import java.util.List;

import org.spring.backend.store.subscription.dto.SubscriptionDto;
import org.spring.backend.store.subscription.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscription")
public class SubscriptionController {
      private final SubscriptionService subscriptionService;

    // 구독 신청
    @PostMapping("/{memberId}/{productId}")
    public ResponseEntity<Void> insertSubscription(
            @PathVariable Long memberId,
            @PathVariable Long productId,
            @RequestBody SubscriptionDto subscriptionDto) {

        subscriptionService.insertSubscription(memberId, productId, subscriptionDto);
        return ResponseEntity.ok().build();
    }

    // 내 구독 목록
    @GetMapping("/{memberId}")
    public ResponseEntity<List<SubscriptionDto>> subscriptionList(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(subscriptionService.subscriptionList(memberId));
    }

    // 구독 상세
    @GetMapping("/detail/{subscriptionId}")
    public ResponseEntity<SubscriptionDto> subscriptionDetail(
            @PathVariable Long subscriptionId) {

        return ResponseEntity.ok(subscriptionService.subscriptionDetail(subscriptionId));
    }

    // 구독 상태 변경
    @PatchMapping("/{subscriptionId}/status")
    public ResponseEntity<Void> updateSubscriptionStatus(
            @PathVariable Long subscriptionId,
            @RequestBody SubscriptionDto subscriptionDto) {

        subscriptionService.updateSubscriptionStatus(subscriptionId, subscriptionDto);
        return ResponseEntity.ok().build();
    }

    // 구독 취소
    @PatchMapping("/{subscriptionId}/cancel")
    public ResponseEntity<Void> cancelSubscription(
            @PathVariable Long subscriptionId) {

        subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.ok().build();
    }

    // 다음 결제일 갱신(자동결제)
    @PatchMapping("/{subscriptionId}/nextPayment")
    public ResponseEntity<Void> updateNextPaymentDate(
            @PathVariable Long subscriptionId) {

        subscriptionService.updateNextPaymentDate(subscriptionId); //추후 스케줄러에서 작성
        return ResponseEntity.ok().build();
    }
}
