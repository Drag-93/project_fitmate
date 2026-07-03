package org.spring.backend.store.order.controller;

import java.util.List;

import org.spring.backend.store.order.dto.OrderDto;
import org.spring.backend.store.order.service.OrderService;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {
  private final OrderService orderService;

  // 상품 상세에서 바로 주문
  @PostMapping("/direct/{memberId}")
  public ResponseEntity<Void> directOrder(
      @PathVariable Long memberId,
      @RequestBody OrderDto orderDto) {

    orderService.insertDirectOrder(memberId, orderDto);
    return ResponseEntity.ok().build();
  }

  // 장바구니 주문
  @PostMapping("/cart/{memberId}")
  public ResponseEntity<Void> cartOrder(
      @PathVariable Long memberId,
      @RequestBody List<Long> cartListIds,
      @RequestBody OrderDto orderDto) {

    orderService.insertCartOrder(memberId, cartListIds, orderDto);
    return ResponseEntity.ok().build();
  }

  // 주문 목록
  @GetMapping("/{memberId}")
  public ResponseEntity<List<OrderDto>> orderList(
      @PathVariable Long memberId) {

    return ResponseEntity.ok(orderService.orderList(memberId));
  }

  // 주문 상세
  @GetMapping("/detail/{orderId}")
  public ResponseEntity<OrderDto> orderDetail(
      @PathVariable Long orderId) {

    return ResponseEntity.ok(orderService.orderDetail(orderId));
  }

  // 주문 취소
  @DeleteMapping("/{orderId}")
  public ResponseEntity<Void> cancelOrder(
      @PathVariable Long orderId) {

    orderService.cancelOrder(orderId);
    return ResponseEntity.ok().build();
  }

  // 배송 상태 변경
  @PatchMapping("/{orderId}/delivery-status")
  public ResponseEntity<Void> updateStatus(
      @PathVariable Long orderId,
      @RequestParam DeliveryStatus deliveryStatus) {

    orderService.updateOrderStatus(orderId, deliveryStatus);
    return ResponseEntity.ok().build();
  }
}
