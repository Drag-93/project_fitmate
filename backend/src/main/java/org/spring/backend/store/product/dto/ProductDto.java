package org.spring.backend.store.product.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.product.type.ProductStatus;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
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

  private MultipartFile thumbnail;

  private List<MultipartFile> main;

  private List<MultipartFile> detailImages;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  private String category;

  private int duration; // 이용기간(일)

  private int sessionCount; // PT 횟수

  public static ProductDto toProductDto(ProductEntity productEntity) {
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
        .category(productEntity.getCategory())
        .duration(productEntity.getDuration())
        .sessionCount(productEntity.getSessionCount())
        .build();
  }
}
