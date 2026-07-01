package org.spring.backend.store.order.service;

import java.util.List;

import org.spring.backend.store.order.dto.OrderDto;

public interface OrderService {
      // 주문 생성
      void insertOrder(Long memberId, OrderDto orderDto);

      // 주문 목록 조회
      List<OrderDto> orderList(Long memberId);
  
      // 주문 상세 조회
      OrderDto orderDetail(Long orderId);
  
      // 주문 취소
      void cancelOrder(Long orderId);
  
      // 주문 상태 변경
      void updateOrderStatus(Long orderId);
}
