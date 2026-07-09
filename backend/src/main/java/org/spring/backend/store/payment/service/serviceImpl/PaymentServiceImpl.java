package org.spring.backend.store.payment.service.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.repository.OrderRepository;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.order.type.OrderStatus;
import org.spring.backend.store.payment.dto.PaymentDto;
import org.spring.backend.store.payment.entity.PaymentEntity;
import org.spring.backend.store.payment.repository.PaymentRepository;
import org.spring.backend.store.payment.service.PaymentService;
import org.spring.backend.store.payment.type.PaymentMethod;
import org.spring.backend.store.payment.type.PaymentStatus;
import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.spring.backend.store.subscription.repository.SubscriptionRepository;
import org.spring.backend.store.subscription.type.SubscriptionStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;
  private final SubscriptionRepository subscriptionRepository;

  @Override
  public void paymentInsert(PaymentDto paymentDto) {

    // 일반 상품 결제
    if (paymentDto.getOrderId() != null) {

      OrderEntity orderEntity = orderRepository.findById(paymentDto.getOrderId())
          .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

      PaymentEntity paymentEntity = PaymentEntity.builder()
          .orderEntity(orderEntity)
          .amount(paymentDto.getAmount())
          .paymentMethod(paymentDto.getPaymentMethod())
          .paymentStatus(PaymentStatus.READY)
          .build();

      paymentRepository.save(paymentEntity);

      paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
      paymentEntity.setApproveTime(LocalDateTime.now());

      orderEntity.setOrderStatus(OrderStatus.SUCCESS);
      orderEntity.setDeliveryStatus(DeliveryStatus.READY);
    }

    // 구독 결제
    else if (paymentDto.getSubscriptionId() != null) {

      SubscriptionEntity subscriptionEntity = subscriptionRepository.findById(paymentDto.getSubscriptionId())
          .orElseThrow(() -> new IllegalArgumentException("구독이 존재하지 않습니다."));

      PaymentEntity paymentEntity = PaymentEntity.builder()
          .subscriptionEntity(subscriptionEntity)
          .amount(paymentDto.getAmount())
          .paymentMethod(paymentDto.getPaymentMethod())
          .paymentStatus(PaymentStatus.READY)
          .build();

      paymentRepository.save(paymentEntity);

      paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
      paymentEntity.setApproveTime(LocalDateTime.now());

      subscriptionEntity.setSubscriptionStatus(SubscriptionStatus.ACTIVE);
      subscriptionEntity.setStartDate(LocalDateTime.now());
      subscriptionEntity.setNextPaymentDate(LocalDateTime.now().plusMonths(1));
    }

    // 둘 다 없는 경우
    else {
      throw new IllegalArgumentException("주문 또는 구독 정보가 필요합니다.");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<PaymentDto> paymentListFn(Long memberId) {
    return paymentRepository.findByOrderEntity_MemberEntity_Id(memberId)
        .stream()
        .map(PaymentDto::toPaymentDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<PaymentDto> paymentAllList() {
    return paymentRepository.findAll()
        .stream()
        .map(PaymentDto::toPaymentDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public PaymentDto findById(Long id) {
    PaymentEntity paymentEntity = paymentRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("결제가 존재하지 않습니다."));

    return PaymentDto.toPaymentDto(paymentEntity);
  }

  @Override
  public void paymentApproval(String pgToken, Long paymentId, Long productPrice, String productName, Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'paymentApproval'");
  }

  @Override
  public void paymentApproveKakao(PaymentEntity paymentEntity, String tid, Long productPrice, String productName,
      Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'paymentApproveKakao'");
  }

  @Override
  public String getJsonDb() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getJsonDb'");
  }

  @Override
  public String extractTidFromJson(String jsonString) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'extractTidFromJson'");
  }

  @Override
  public String pgRequest(String pg, Long productId, Long memberId, Long productPrice, String productName) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'pgRequest'");
  }

}
