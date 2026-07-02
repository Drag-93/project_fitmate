package org.spring.backend.store.product.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.product.entity.ProductFileEntity;
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
public class ProductFileDto {

  private Long id;

  private String newFileName; //S3 url

  private String oldFileName;

  private int sortOrder; //이미지 순서

  private ImageType imageType;

  private Long productId;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static ProductFileDto toProductFileDto(ProductFileEntity productFileEntity){
    return ProductFileDto.builder()
    .id(productFileEntity.getId())
    .newFileName(productFileEntity.getNewFileName())
    .oldFileName(productFileEntity.getOldFileName())
    .sortOrder(productFileEntity.getSortOrder())
    .imageType(productFileEntity.getImageType())
    .productId(productFileEntity.getProductEntity().getId())
    .createTime(productFileEntity.getCreateTime())
    .updateTime(productFileEntity.getUpdateTime())
    .build();
  }
}
