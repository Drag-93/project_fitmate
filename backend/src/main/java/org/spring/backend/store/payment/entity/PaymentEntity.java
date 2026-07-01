package org.spring.backend.store.payment.entity;

import java.time.LocalDateTime;

import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.payment.type.PaymentMethod;
import org.spring.backend.store.payment.type.PaymentStatus;
import org.spring.backend.store.subscription.entity.SubscriptionEntity;

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
import jakarta.persistence.OneToOne;
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
@Table(name = "payment_tb")
public class PaymentEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "payment_id")
  private Long id;

  private Long tid; // 카카오결제ID

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentMethod paymentMethod;// 결제수단

  @Column(nullable = false)
  private int amount; // 결제금액

  private LocalDateTime approveTime; // 결제 승인 시간

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus paymentStatus;

  // N:1
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "subscription_id")
  private SubscriptionEntity subscriptionEntity;

  // 1: 1
  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id")
  private OrderEntity orderEntity;
}
