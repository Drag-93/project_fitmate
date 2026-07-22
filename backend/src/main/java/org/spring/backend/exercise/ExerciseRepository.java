package org.spring.backend.exercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, String> {

    // 부위 + 장비 조건이 둘 다 있을 때
    List<Exercise> findByTargetIgnoreCaseAndEquipmentIgnoreCase(String target, String equipment);

    // 부위만으로 조회 (equipment 미지정/캐시 부족 시 폴백용)
    List<Exercise> findByTargetIgnoreCase(String target);

    boolean existsByTargetIgnoreCase(String target);

    // 스케줄러가 "이미 한 번 캐싱된 부위"만 재동기화하기 위해 조회
    @Query("SELECT DISTINCT e.target FROM Exercise e")
    List<String> findDistinctTargets();

    // ★ 추가: 번역 배치(ExerciseTranslationService)가 대상을 찾을 때 사용
    List<Exercise> findByNameKoIsNull();
}