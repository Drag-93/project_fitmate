package org.spring.backend.exercise;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class ExerciseDto {

    // Response.from(plan)에서 exerciseDetailsJson을 되돌릴 때 사용.
    // 정적 메서드 안이라 스프링 빈 주입이 안 되므로 별도 인스턴스를 둠 (상태 없는 도구라 문제 없음).
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Getter @Setter
    public static class Request {
        private String target;
        private String equip;
    }

    @Getter @Builder
    public static class Response {
        private Long id;
        private String name;
        private String nameKo; // ★ 추가 - 화면 타이틀용 한글 부위명
        private String gifUrl;
        private String routine;
        private LocalDateTime createTime;
        private List<ExerciseDetail> exerciseDetails;

        /**
         * 방금 생성된 루틴 응답용. 이미 메모리에 있는 exerciseDetails를 그대로 채운다.
         */
        public static Response from(ExercisePlan plan, List<ExerciseDetail> exerciseDetails) {
            return Response.builder()
                    .id(plan.getId())
                    .name(plan.getName())
                    .nameKo(displayNameKo(plan))
                    .gifUrl(plan.getGifUrl())
                    .routine(plan.getRoutine())
                    .createTime(plan.getCreateTime())
                    .exerciseDetails(exerciseDetails)
                    .build();
        }

        /**
         * 히스토리 조회용. 이제는 exerciseDetailsJson에 구조화된 데이터가 저장되어 있으므로
         * 그대로 역직렬화해서 상세를 복원한다 (예전엔 빈 리스트로 내려가던 부분 수정).
         */
        public static Response from(ExercisePlan plan) {
            return Response.builder()
                    .id(plan.getId())
                    .name(plan.getName())
                    .nameKo(displayNameKo(plan))
                    .gifUrl(plan.getGifUrl())
                    .routine(plan.getRoutine())
                    .createTime(plan.getCreateTime())
                    .exerciseDetails(deserializeDetails(plan.getExerciseDetailsJson()))
                    .build();
        }

        private static String displayNameKo(ExercisePlan plan) {
            String nameKo = plan.getNameKo();
            return (nameKo != null && !nameKo.isBlank()) ? nameKo : plan.getName();
        }

        private static List<ExerciseDetail> deserializeDetails(String json) {
            if (json == null || json.isBlank()) return List.of();
            try {
                return MAPPER.readValue(json, new TypeReference<List<ExerciseDetail>>() {});
            } catch (Exception e) {
                // 예전 데이터(마이그레이션 전에 저장된 row)는 json이 없을 수 있으니
                // 실패해도 예외를 던지지 않고 빈 리스트로 폴백
                return List.of();
            }
        }
    }
}