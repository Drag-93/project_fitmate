package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long>{
    @Query("SELECT c FROM CategoryEntity c JOIN FETCH c.tabEntity")
    List<CategoryEntity> findAllWithTab();

}
