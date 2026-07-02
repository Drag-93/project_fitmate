package org.spring.backend.store.order.service.serviceImpl;

import java.util.List;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.order.dto.OrderDto;
import org.spring.backend.store.order.dto.OrderItemDto;
import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.entity.OrderItemEntity;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.order.repository.OrderRepository;
import org.spring.backend.store.order.service.OrderService;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.order.type.OrderStatus;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final OrderItemRepository orderItemRepository;
  private final MemberRepository memberRepository;
  private final ProductRepository productRepository;

  @Override
  public void insertOrder(Long memberId, OrderDto orderDto) {
    // 회원 조회
    MemberEntity memberEntity = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

    // 주문 생성
    OrderEntity orderEntity = OrderEntity.builder()
        .totalPrice(0)
        .orderStatus(OrderStatus.PENDING)
        .deliveryStatus(DeliveryStatus.READY)
        .receiverName(orderDto.getReceiverName())
        .receiverPhone(orderDto.getReceiverPhone())
        .address(orderDto.getAddress())
        .deliveryMemo(orderDto.getDeliveryMemo())
        .memberEntity(memberEntity)
        .build();

    orderRepository.save(orderEntity);

    int totalPrice = 0;

    // 주문 상품 저장
    for (OrderItemDto itemDto : orderDto.getOrderItemDtos()) {

      ProductEntity productEntity = productRepository.findById(itemDto.getProductId())
          .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

      OrderItemEntity orderItemEntity = OrderItemEntity.builder()
          .productEntity(productEntity)
          .orderEntity(orderEntity)
          .price(productEntity.getPrice())
          .quantity(itemDto.getQuantity())
          .productName(productEntity.getProductName())
          .build();

      orderItemRepository.save(orderItemEntity);

      totalPrice += productEntity.getPrice() * itemDto.getQuantity();
    }

    orderEntity.setTotalPrice(totalPrice);
  }


  @Override
  public List<OrderDto> orderList(Long memberId) {

    return orderRepository.findByMemberEntityId(memberId)
        .stream()
        .map(OrderDto::toOrderDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public OrderDto orderDetail(Long orderId) {
    OrderEntity orderEntity = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

    return OrderDto.toOrderDto(orderEntity);
  }

  @Override
  public void cancelOrder(Long orderId) {
    OrderEntity orderEntity = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

    orderEntity.setOrderStatus(OrderStatus.CANCELED);
  }

  @Override
  public void updateOrderStatus(Long orderId, DeliveryStatus deliveryStatus) {

    OrderEntity orderEntity = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

    orderEntity.setDeliveryStatus(deliveryStatus);
  }

}
