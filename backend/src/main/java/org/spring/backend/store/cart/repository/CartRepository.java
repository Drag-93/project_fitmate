package org.spring.backend.cart.repository;

import org.spring.backend.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity,Long>{
  
}
