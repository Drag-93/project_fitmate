package org.spring.backend.store.order.dto;

import org.spring.backend.store.order.entity.OrderItemEntity;

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
public class OrderItemDto {
  private Long id;

  private int price;

  private int quantity;

  private String productName;

  private String productImage;

  private Long productId;

  private Long orderId;

  public static OrderItemDto toOrderItemDto(OrderItemEntity orderItemEntity) {
  return OrderItemDto.builder()
      .id(orderItemEntity.getId())
      .productName(orderItemEntity.getProductName())
      .price(orderItemEntity.getPrice())
      .quantity(orderItemEntity.getQuantity())
      .productImage(orderItemEntity.getProductImage())
      .productId(orderItemEntity.getProductEntity().getId())
      .orderId(orderItemEntity.getOrderEntity().getId())
      .build();  
}
}
