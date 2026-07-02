package org.spring.backend.store.subscription.repository;

import java.util.List;

import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity,Long>{
  List<SubscriptionEntity> findByMemberEntity_Id(Long memberId);
  
}
