package org.spring.backend.store.product.repository;

import java.util.List;
import java.util.Optional;

import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

  Page<ProductEntity> findByProductType(ProductType productType, Pageable pageable);

  Page<ProductEntity> findByProductNameContaining(String keyword, Pageable pageable);

  @EntityGraph(attributePaths = "productFileEntities")
  Optional<ProductEntity> findById(Long id);

  Page<ProductEntity> findAll(Pageable pageable);

}
