package org.spring.backend.admin.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDto {
    private Integer id;

    private String content;
    // HTML5 datetime-local 포맷("yyyy-MM-ddTHH:mm")을 자바 Date로 자동 바인딩
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date start;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date end;
}
