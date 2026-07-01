package org.spring.backend.store.cart.repository;

import org.spring.backend.store.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity,Long>{
  
}
