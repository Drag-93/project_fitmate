package org.spring.backend.store.order.service;

import java.util.List;

import org.spring.backend.store.order.dto.OrderDto;
import org.spring.backend.store.order.type.DeliveryStatus;

public interface OrderService {

      // 상품 상세에서 바로 주문
      void insertDirectOrder(Long memberId, OrderDto orderDto);

      // 장바구니에서 주문
      void insertCartOrder(Long memberId,List<Long> cartListIds, OrderDto orderDto);

      // 주문 목록 조회
      List<OrderDto> orderList(Long memberId);

      // 주문 상세 조회
      OrderDto orderDetail(Long orderId);

      // 주문 취소
      void cancelOrder(Long orderId);

      // 주문 상태 변경
      void updateOrderStatus(Long orderId, DeliveryStatus deliveryStatus);
}
