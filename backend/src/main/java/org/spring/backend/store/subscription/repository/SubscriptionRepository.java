package org.spring.backend.store.subscription.repository;

import java.util.List;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.subscription.entity.SubscriptionEntity;
import org.spring.backend.store.subscription.type.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity,Long>{
  List<SubscriptionEntity> findByMemberEntity_Id(Long memberId);

  boolean existsByMemberEntityAndProductEntityAndSubscriptionStatus(
        MemberEntity memberEntity,
        ProductEntity productEntity,
        SubscriptionStatus subscriptionStatus
);
  
}
