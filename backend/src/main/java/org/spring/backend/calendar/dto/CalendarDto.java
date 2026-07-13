package org.spring.backend.calendar.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDto {
    // Calendar에서 사용하는 고유 ID
    private Long id;

    // 원본 Entity의 ID
    private Long sourceId;

    // 일정 종류 (SUBSCRIPTION, PT, PERSONAL, WORKOUT, ALL)
    private String eventType;

    // 일정 제목
    private String title;

    // 시작일시
    private LocalDateTime start;

    // 종료일시
    private LocalDateTime end;

    // 상세 내용
    private String description;

    // 수정 가능 여부
    private Boolean editable;
}
