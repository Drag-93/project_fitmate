package org.spring.backend.store.notification.repository;

import org.spring.backend.store.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<ReviewEntity,Long>{
  
}
