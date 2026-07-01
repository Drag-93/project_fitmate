package org.spring.backend.store.subscription.entity;

import java.time.LocalDateTime;

import org.spring.backend.common.BasicTime;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.subscription.type.SubscriptionStatus;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "subscription_tb")
public class SubscriptionEntity extends BasicTime{
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "subscription_id")
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SubscriptionStatus subscriptionStatus;

  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private LocalDateTime nextPaymentDate;

    // N:1
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id")
  private ProductEntity productEntity;

    // //N:1
  // @JsonIgnore
  // @ManyToOne(fetch = FetchType.LAZY)
  // @JoinColumn(name = "member_id")
  // private MemberEntity memberEntity;
}
