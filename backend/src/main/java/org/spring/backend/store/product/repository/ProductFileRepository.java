package org.spring.backend.store.product.repository;

import java.util.List;
import java.util.Optional;

import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.entity.ProductFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductFileRepository extends JpaRepository<ProductFileEntity, Long> {
  List<ProductFileEntity> findByProductEntity(ProductEntity productEntity);

  void deleteByProductEntity(ProductEntity productEntity);

  Optional<ProductFileEntity> findById(Long id);
}
