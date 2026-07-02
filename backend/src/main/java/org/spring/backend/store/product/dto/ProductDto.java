package org.spring.backend.store.product.dto;
import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.entity.ProductFileEntity;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.product.type.ProductStatus;
import org.spring.backend.store.product.type.ProductType;

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
public class ProductDto {

  private Long id;

  private String productName;

  private int price;

  private String description;

  private ProductType productType;

  private BillingType billingType;

  private ProductStatus productStatus;

  private List<ProductFileDto> productFileDtos;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static ProductDto toProductDto(ProductEntity productEntity){
    return ProductDto.builder()
    .id(productEntity.getId())
    .productName(productEntity.getProductName())
    .price(productEntity.getPrice())
    .description(productEntity.getDescription())
    .productType(productEntity.getProductType())
    .billingType(productEntity.getBillingType())
    .productStatus(productEntity.getProductStatus())
    .productFileDtos(productEntity.getProductFileEntities() == null 
      ? List.of() 
      : productEntity.getProductFileEntities()
        .stream()
        .map(ProductFileDto::toProductFileDto).toList())
    .createTime(productEntity.getCreateTime())
    .updateTime(productEntity.getUpdateTime())
    .build();
  }
}
