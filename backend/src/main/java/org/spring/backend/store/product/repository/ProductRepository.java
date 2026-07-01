package org.spring.backend.store.product.repository;

import org.spring.backend.store.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity,Long>{
  
}
