package org.spring.backend.store.review.repository;

import org.spring.backend.store.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity,Long>{
  
}
