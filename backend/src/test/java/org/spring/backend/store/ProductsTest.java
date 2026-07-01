package org.spring.backend.store;

import org.junit.jupiter.api.Test;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.product.type.ProductStatus;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProductsTest {

  @Autowired
  ProductRepository productRepository;

  @Test
  void insert() {
    for (int i = 0; i < 10; i++) {

      ProductEntity productEntity = ProductEntity.builder()
          .productName("상품" + i)
          .description("상품" + i + "설명입니다.")
          .price(10000 + i)
          .productType(ProductType.GOODS)
          .billingType(BillingType.ONE_TIME)
          .productStatus(ProductStatus.ACTIVE)
          .build();

      productRepository.save(productEntity);
    }
  }

  @Test
  void insert2() {
    for (int i = 0; i < 4; i++) {

      ProductEntity productEntity = ProductEntity.builder()
          .productName("헬스장 이용권" + i)
          .description("헬스장 이용권" + i + "설명입니다.")
          .price(10000 + i)
          .productType(ProductType.GYM)
          .billingType(BillingType.ONE_TIME)
          .productStatus(ProductStatus.ACTIVE)
          .build();

      productRepository.save(productEntity);
    }
  }

  @Test
  void insert3() {
    for (int i = 0; i < 4; i++) {

      ProductEntity productEntity = ProductEntity.builder()
          .productName("PT이용권" + i)
          .description("PT이용권" + i + "설명입니다.")
          .price(10000 + i)
          .productType(ProductType.PT)
          .billingType(BillingType.ONE_TIME)
          .productStatus(ProductStatus.ACTIVE)
          .build();

      productRepository.save(productEntity);
    }
  }
  @Test
  void insert4() {
    for (int i = 0; i < 4; i++) {

      ProductEntity productEntity = ProductEntity.builder()
          .productName("프리미엄 구독" + i)
          .description("프리미엄 구독" + i + "설명입니다.")
          .price(10000 + i)
          .productType(ProductType.PREMIUM)
          .billingType(BillingType.SUBSCRIPTION)
          .productStatus(ProductStatus.ACTIVE)
          .build();

      productRepository.save(productEntity);
    }
  }

}
