package org.spring.backend.subscription.repository;

import org.spring.backend.subscription.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity,Long>{
  
}
