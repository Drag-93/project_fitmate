package org.spring.backend.review.repository;

import org.spring.backend.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<ReviewEntity,Long>{
  
}
