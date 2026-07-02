package org.spring.backend.store.product.repository;

import java.util.List;

import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

  List<ProductEntity> findByProductType(ProductType productType);

  List<ProductEntity> findByProductNameContaining(String keyword);
}
