package org.spring.backend.store.cart.dto;

import java.time.LocalDateTime;

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
public class CartListDto {
  private Long id;

  private int quantity;

  private Long productId;

  private Long cartId;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;
}
