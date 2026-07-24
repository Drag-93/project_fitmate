package org.spring.backend.exercise;

import lombok.*;

/**
 * @NoArgsConstructor + @Setter 조합은 Jackson이 JSON <-> 객체 변환을 할 수 있게 하기 위함
 * (ExercisePlan.exerciseDetailsJson에 저장/복원할 때 필요). @Builder는 서비스 코드에서
 * 기존처럼 빌더 스타일로 생성할 수 있게 그대로 유지.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseDetail {
    private String id;         // ExerciseDB의 exerciseId - 프론트가 /api/exercise/image/{id}로 GIF 지연 로딩할 때 사용
    private String name;
    private String target;
    private String equipment;
    private int sets;
    private String reps;
    private int restSeconds;
}