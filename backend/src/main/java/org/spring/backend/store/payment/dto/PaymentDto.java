package org.spring.backend.store.payment.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.payment.entity.PaymentEntity;
import org.spring.backend.store.payment.type.PaymentMethod;
import org.spring.backend.store.payment.type.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class PaymentDto {
  private Long id;

  // 카카오페이 결제 ID
  private Long tid;

  // 결제수단
  private PaymentMethod paymentMethod;

  // 결제금액
  private int amount;

  // 결제 승인 시간
  private LocalDateTime approveTime;

  private PaymentStatus paymentStatus;

  // 주문 ID
  private Long orderId;

  private Long subscriptionId;

  private LocalDateTime createTime;

  public static PaymentDto toPaymentDto(PaymentEntity paymentEntity) {
    return PaymentDto.builder()
        .id(paymentEntity.getId())
        .tid(paymentEntity.getTid())
        .paymentMethod(paymentEntity.getPaymentMethod())
        .amount(paymentEntity.getAmount())
        .approveTime(paymentEntity.getApproveTime())
        .paymentStatus(paymentEntity.getPaymentStatus())
        .orderId(paymentEntity.getOrderEntity() != null
            ? paymentEntity.getOrderEntity().getId()
            : null)
        .subscriptionId(paymentEntity.getSubscriptionEntity() != null
            ? paymentEntity.getSubscriptionEntity().getId()
            : null)
        .createTime(paymentEntity.getCreateTime())
        .build();
  }

}
