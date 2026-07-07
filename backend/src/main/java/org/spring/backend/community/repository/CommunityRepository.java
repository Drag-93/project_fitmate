package org.spring.backend.community.repository;

import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.entity.CommunityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface CommunityRepository extends JpaRepository<CommunityEntity, Long>{

List<CommunityDto> findByCategoryEntity_Id(Long categoryId);

    @Query("SELECT c FROM CommunityEntity c WHERE c.categoryEntity.tabEntity.id = :tabId")
    List<CommunityEntity> findByTabId(@Param("tabId") Long tabId);


    // 공지사항만 최신순 TOP 5
    List<CommunityEntity> findTop5ByCategoryNameOrderByCreateTimeDesc(
            String categoryName
    );

    // 비회원용: notice 제외하고 조회수 높은순 TOP 5
    List<CommunityEntity> findTop5ByCategoryNameNotOrderByHitDesc(
            String categoryName
    );

    // 로그인 회원용: 관심사 카테고리 기준 조회수 높은순 TOP 5
    List<CommunityEntity> findTop5ByCategoryNameOrderByHitDesc(
            String categoryName
    );
}
