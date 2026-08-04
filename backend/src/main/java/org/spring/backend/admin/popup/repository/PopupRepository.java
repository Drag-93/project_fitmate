package org.spring.backend.admin.popup.repository;

import org.spring.backend.admin.popup.entity.PopupEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PopupRepository extends JpaRepository<PopupEntity, Long> {

    // 메인 페이지 노출 팝업 조회
    // 1. 현재 시간(LocalDateTime.now())을 기준으로 조회
    // 2. active = true
    // 3. startDate <= 현재시간 <= endDate
    // 4. 노출 순서(sortOrder) 오름차순 정렬
    @Query("""
        SELECT p
        FROM PopupEntity p
        WHERE p.active = true
          AND p.startDate <= :now
          AND p.endDate >= :now
        ORDER BY p.sortOrder ASC
    """)
    List<PopupEntity> findActivePopup(
            @Param("now") LocalDateTime now
    );

    // 관리자 - 현재 노출중인 팝업 조회
    // 1. active = true
    // 2. 현재 시간이 노출 기간 안에 있는 팝업만 조회
    // 3. 제목 검색(search)이 입력되면 제목 LIKE 검색
    // 4. 정렬은 Service에서 Pageable Sort로 처리
    @Query("""
        SELECT p
        FROM PopupEntity p
        WHERE p.active = true
          AND p.startDate <= :now
          AND p.endDate >= :now
          AND (
                :search = ''
                OR p.title LIKE CONCAT('%', :search, '%')
              )
    """)
    Page<PopupEntity> findVisiblePopupList(
            @Param("now") LocalDateTime now,
            @Param("search") String search,
            Pageable pageable
    );

    // 관리자 - 현재 미노출 팝업 조회
    // 아래 조건 중 하나라도 만족하면 미노출
    // 1. active = false
    // 2. 아직 노출 시작 전(startDate > 현재시간)
    // 3. 노출 기간 종료(endDate < 현재시간)
    // 4. 제목 검색(search)이 입력되면 제목 LIKE 검색
    // 5. 정렬은 Service에서 Pageable Sort로 처리
    @Query("""
        SELECT p
        FROM PopupEntity p
        WHERE (
                p.active = false
                OR p.startDate > :now
                OR p.endDate < :now
              )
          AND (
                :search = ''
                OR p.title LIKE CONCAT('%', :search, '%')
              )
    """)
    Page<PopupEntity> findHiddenPopupList(
            @Param("now") LocalDateTime now,
            @Param("search") String search,
            Pageable pageable
    );

    // 관리자 - 전체 팝업 조회
    // 1. 노출 여부와 관계없이 전체 조회
    // 2. 제목 검색(search)이 입력되면 제목 LIKE 검색
    // 3. 정렬은 Service에서 Pageable Sort로 처리
    Page<PopupEntity> findByTitleContaining(
            String search,
            Pageable pageable
    );
}