package org.spring.backend.store.order.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.order.type.OrderStatus;

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
public class OrderDto {
  private Long id;

  private int totalPrice;

  private OrderStatus orderStatus;

  private DeliveryStatus deliveryStatus;

  private String receiverName;

  private String receiverPhone;

  private String address;

  private List<OrderItemDto> orderItemDtos;

  private String deliveryMemo;

  private LocalDateTime createTime;

  public static OrderDto tOrderDto(OrderEntity orderEntity){
    return OrderDto.builder()
    .id(orderEntity.getId())
    .totalPrice(orderEntity.getTotalPrice())
    .orderStatus(orderEntity.getOrderStatus())
    .deliveryStatus(orderEntity.getDeliveryStatus())
    .receiverName(orderEntity.getReceiverName())
    .receiverPhone(orderEntity.getReceiverPhone())
    .address(orderEntity.getAddress())
    .orderItemDtos(orderEntity.getOrderItemEntities().stream().map(OrderItemDto::toOrderItemDto).toList())
    .deliveryMemo(orderEntity.getDeliveryMemo())
    .createTime(orderEntity.getCreateTime())
    .build();
  }

}
