package org.spring.backend.exercise;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExerciseDetail {
    private String name;
    private String target;
    private String equipment;
    private String gifUrl;
    private String id;

    // 규칙 기반(non-AI) 처방값
    private int sets;
    private String reps;       // 예: "8-12"
    private int restSeconds;
}
