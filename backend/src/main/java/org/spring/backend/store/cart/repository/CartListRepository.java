package org.spring.backend.store.cart.repository;


import java.util.List;
import java.util.Optional;

import org.spring.backend.store.cart.entity.CartListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartListRepository extends JpaRepository<CartListEntity,Long>{

  List<CartListEntity> findByCartEntityId(Long cartId);

  void deleteByCartEntityId(Long cartId);
  
  int countByCartEntityId(Long cartId);

  
  Optional<CartListEntity> findByCartEntityIdAndProductEntityId(Long cartId, Long productId);
  
}
