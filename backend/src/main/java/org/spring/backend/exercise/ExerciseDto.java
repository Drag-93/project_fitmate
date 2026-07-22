package org.spring.backend.exercise;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class ExerciseDto {
    @Getter @Setter
    public static class Request {
        private String target;
        private String equip;
    }

    @Getter @Builder
    public static class Response {
        private Long id;
        private String name;
        private String gifUrl;
        private String routine;
        private LocalDateTime createTime;
        private List<ExerciseDetail> exerciseDetails;

        /**
         * exerciseDetails까지 채워서 응답을 만든다.
         * (기존에는 plan만 받아 빈 리스트로 나가던 버그가 있었음)
         */
        public static Response from(ExercisePlan plan, List<ExerciseDetail> exerciseDetails) {
            return Response.builder()
                    .id(plan.getId())
                    .name(plan.getName())
                    .gifUrl(plan.getGifUrl())
                    .routine(plan.getRoutine())
                    .createTime(plan.getCreateTime()) // BasicTime에 getCreatedAt()이 없다면 실제 필드/getter명으로 교체
                    .exerciseDetails(exerciseDetails)
                    .build();
        }

        /**
         * 히스토리 조회용. 과거 루틴은 exerciseDetails를 다시 만들 수 없으므로
         * (원래 계산 결과가 DB에 구조화되어 저장되지 않고 routine 텍스트로만 남음)
         * 빈 리스트로 내려준다. routine 텍스트 안에 세트/렙 정보는 이미 포함돼 있다.
         */
        public static Response from(ExercisePlan plan) {
            return Response.builder()
                    .id(plan.getId())
                    .name(plan.getName())
                    .gifUrl(plan.getGifUrl())
                    .routine(plan.getRoutine())
                    .createTime(plan.getCreateTime())
                    .exerciseDetails(List.of())
                    .build();
        }
    }
}
