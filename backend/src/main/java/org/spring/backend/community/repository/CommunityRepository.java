package org.spring.backend.community.repository;

import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.entity.CommunityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommunityRepository extends JpaRepository<CommunityEntity, Long>{

List<CommunityDto> findByCategoryEntity_Id(Long categoryId);

    @Query("SELECT c FROM CommunityEntity c WHERE c.categoryEntity.tabEntity.id = :tabId")
    List<CommunityEntity> findByTabId(@Param("tabId") Long tabId);
}
