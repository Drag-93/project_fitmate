package org.spring.backend.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.dto.CalendarDto;
import org.spring.backend.admin.entity.CalendarEntity;
import org.spring.backend.admin.repository.CalendarRepository;
import org.spring.backend.admin.service.CalendarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {

    private final CalendarRepository calendarRepository;

    //전체 일정 조회
    @Override
    @Transactional(readOnly = true) // 단순 조회 시 성능 최적화를 위해 추가
    public List<CalendarDto> calendarListAll() {
        return calendarRepository.findAll().stream()
                .map(calendarEntity -> CalendarDto.builder()
                        .id(calendarEntity.getId())
                        .start(calendarEntity.getStart())
                        .content(calendarEntity.getContent())
                        .end(calendarEntity.getEnd())
                        .build())
                .collect(Collectors.toList());
    }
    //일정 등록
    @Override
    @Transactional
    public void setCalendar(CalendarDto calendarDto) {
        CalendarEntity calendarEntity= CalendarEntity.builder()
                .start(calendarDto.getStart())
                .end(calendarDto.getEnd())
                .content(calendarDto.getContent())
                .build();

        calendarRepository.save(calendarEntity);
    }
}
