package org.spring.backend.store.cart.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.cart.entity.CartListEntity;
import org.spring.backend.store.product.type.ImageType;

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

  private String productName;

  private int price;

  private String productImage;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static CartListDto toCartListDto(CartListEntity cartListEntity) {
    return CartListDto.builder()
        .id(cartListEntity.getId())
        .quantity(cartListEntity.getQuantity())
        .productId(cartListEntity.getProductEntity() != null
            ? cartListEntity.getProductEntity().getId()
            : null)
        .cartId(cartListEntity.getCartEntity() != null
            ? cartListEntity.getCartEntity().getId()
            : null)
        .productName(cartListEntity.getProductEntity().getProductName())
        .price(cartListEntity.getProductEntity().getPrice())
        .productImage(
          cartListEntity.getProductEntity()
          .getProductFileEntities()
          .stream()
          .filter(file -> file.getImageType() == ImageType.THUMBNAIL)
          .findFirst()
          .map(file -> file.getNewFileName())
          .orElse(null)
      )
        .createTime(cartListEntity.getCreateTime())
        .updateTime(cartListEntity.getUpdateTime())
        .build();
  }
}
