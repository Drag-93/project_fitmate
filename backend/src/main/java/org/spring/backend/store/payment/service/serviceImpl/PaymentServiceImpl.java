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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;

  @Override
  public void paymentInsert(PaymentDto paymentDto) {

    OrderEntity orderEntity = orderRepository.findById(paymentDto.getOrderId())
        .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

    // 1. Payment 생성 (결제 요청 상태)
    PaymentEntity paymentEntity = PaymentEntity.builder()
        .orderEntity(orderEntity)
        .amount(paymentDto.getAmount())
        .paymentMethod(paymentDto.getPaymentMethod())
        .paymentStatus(PaymentStatus.READY)
        .build();
    paymentRepository.save(paymentEntity);

    // 무조건 성공 처리
    paymentEntity.setPaymentStatus(PaymentStatus.SUCCESS);
    paymentEntity.setApproveTime(LocalDateTime.now());

    // 주문 상태 변경
    orderEntity.setOrderStatus(OrderStatus.SUCCESS);
    orderEntity.setDeliveryStatus(DeliveryStatus.READY);
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

}
