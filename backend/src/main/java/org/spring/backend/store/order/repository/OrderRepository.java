package org.spring.backend.order.repository;

import org.spring.backend.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity,Long>{
  
}
