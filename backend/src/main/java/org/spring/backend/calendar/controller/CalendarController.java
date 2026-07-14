package org.spring.backend.calendar.controller;

import lombok.RequiredArgsConstructor;
import org.spring.backend.calendar.dto.CalendarDto;
import org.spring.backend.calendar.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    // 회원별 캘린더 일정 조회
    // 예시:
    // /calendar/1?eventType=ALL
    // /calendar/1?eventType=PT
    // /calendar/1?eventType=WORKOUT
    @GetMapping("/{memberId}")
    public ResponseEntity<List<CalendarDto>> getCalendar(@PathVariable Long memberId,@RequestParam String eventType) {
        List<CalendarDto> calendarList =
                calendarService.getCalendar(memberId, eventType);

        return ResponseEntity.ok(calendarList);
    }
}