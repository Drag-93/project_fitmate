package org.spring.backend.store.payment.dto;

import java.util.List;

import org.spring.backend.store.order.dto.OrderItemDto;
import org.spring.backend.store.product.type.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PaymentSuccessDto {
  private String productName;
  private int amount;
  private String paymentMethod;

  private List<OrderItemDto> orderItems;

  private ProductType productType;
}
