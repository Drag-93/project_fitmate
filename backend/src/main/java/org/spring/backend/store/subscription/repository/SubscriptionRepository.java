package org.spring.backend.store.subscription.repository;

import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity,Long>{
  
}
