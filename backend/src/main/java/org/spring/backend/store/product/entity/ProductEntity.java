package org.spring.backend.store.product.entity;

import java.util.List;

import org.spring.backend.common.BasicTime;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.product.type.ProductStatus;
import org.spring.backend.store.product.type.ProductType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
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
@Table(name = "product_tb")
public class ProductEntity extends BasicTime {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Long id;

  @Column(nullable = false)
  private String productName;

  @Column(nullable = false)
  private int price;

  @Column(nullable = false)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductType productType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BillingType billingType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductStatus productStatus;

  @JsonIgnore
  @OneToMany(mappedBy = "productEntity", cascade = CascadeType.REMOVE)
  private List<ProductFileEntity> productFileEntities;

  // //N:1
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id")
  private MemberEntity memberEntity;

}
