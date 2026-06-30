package org.spring.backend.store.product.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.spring.backend.common.BasicTime;
import org.spring.backend.store.product.type.ImageType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "product_file_tb")
public class ProductFileEntity extends BasicTime{

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_file_id")
  private Long id;

  @Column(nullable = false)
  private String newFileName; //S3 url

  @Column(nullable = false)
  private String oldFileName;

  private int sortOrder; //이미지 순서

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ImageType imageType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id")
  private ProductEntity productEntity;

  @CreationTimestamp
  @Column(updatable = false) 
  private LocalDateTime createTime;

  @UpdateTimestamp
  @Column(insertable = false) 
  private LocalDateTime updateTime;
  
}
