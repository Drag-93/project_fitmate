package org.spring.backend.store.order.dto;

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
}
