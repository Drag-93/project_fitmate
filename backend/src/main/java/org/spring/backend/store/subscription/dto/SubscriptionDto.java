package org.spring.backend.store.subscription.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.subscription.type.SubscriptionStatus;

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
public class SubscriptionDto {
  private Long id;

  private SubscriptionStatus subscriptionStatus;

  private LocalDateTime startDate;

  private LocalDateTime endDate;

  private LocalDateTime nextPaymentDate;
  
  private LocalDateTime createTime;

  private Long productId;

  private String productName;

  private String productImage;
}
