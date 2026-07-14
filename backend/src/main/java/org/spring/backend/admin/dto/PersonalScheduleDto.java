package org.spring.backend.admin.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalScheduleDto {
    private Integer id;

    private String content;

    private LocalDateTime start;

    private LocalDateTime end;
}
