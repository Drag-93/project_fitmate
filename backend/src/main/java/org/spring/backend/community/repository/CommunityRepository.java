package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CommunityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;

public interface CommunityRepository extends JpaRepository<CommunityEntity, Long>,JpaSpecificationExecutor<CommunityEntity>{

    Page<CommunityEntity> findByCategoryEntity_Id(Long categoryId, Pageable pageable);

    Page<CommunityEntity> findByTabId(Long tabId, Pageable pageable);


    // 공지사항만 최신순 TOP 5
    List<CommunityEntity> findTop5ByTabNameOrderByCreateTimeDesc(
            String TabName
    );

    // 비회원용: notice 제외하고 조회수 높은순 TOP 5
    List<CommunityEntity> findTop5ByTabNameNotOrderByHitDesc(
            String TabName
    );

    // 로그인 회원용: 관심사 카테고리 기준 조회수 높은순 TOP 5
    List<CommunityEntity> findTop5ByCategoryNameOrderByHitDesc(
            String categoryName
    );
    //제목 검색
    Page<CommunityEntity> findByTitleContaining(Pageable pageable, String search);
    //내용검색
    Page<CommunityEntity> findByContentContaining(Pageable pageable, String search);
    //작성자 검색
    Page<CommunityEntity> findByUserNameContaining(Pageable pageable, String search);

    // 특정 탭의 조회수 top5
    List<CommunityEntity> findTop5ByCategoryEntity_TabEntity_IdOrderByHitDesc(Long tabId);

    // 특정 탭의 최신순 top5 (공지사항용)
    List<CommunityEntity> findTop5ByCategoryEntity_TabEntity_IdOrderByCreateTimeDesc(Long tabId);

    // 특정 탭 제외 전체 조회수 top5
    List<CommunityEntity> findTop5ByCategoryEntity_TabEntity_IdNotOrderByHitDesc(Long tabId);

     //오늘 작성된 글 개수
    Long countByCreateTimeGreaterThanEqualAndCreateTimeLessThanAndTabNameNot(LocalDateTime startOfToday, LocalDateTime startOfTomorrow, String tabName);
}
