package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long>{
  
}
