package org.spring.backend.store.order.repository;

import java.util.List;

import org.spring.backend.store.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity,Long>{

  @EntityGraph(attributePaths = {"orderItemEntities"}) //N+1 대응
  List<OrderEntity> findByMemberEntityId(Long memberId);
  
}
