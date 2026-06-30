package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CommunityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<CommunityEntity, Long>{
  
}
