package org.spring.backend.exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExercisePlanRepository extends JpaRepository<ExercisePlan, Long> {

    // 최근 생성 순으로 특정 사용자의 루틴 히스토리를 페이지 단위로 조회
    Page<ExercisePlan> findByUserEmailOrderByIdDesc(String userEmail, Pageable pageable);

    //보관 갯수 체크용
    List<ExercisePlan> findByUserEmailOrderByIdDesc(String userEmail);

}
