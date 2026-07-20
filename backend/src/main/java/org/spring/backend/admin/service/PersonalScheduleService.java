package org.spring.backend.admin.service;

import org.spring.backend.admin.dto.PersonalScheduleDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PersonalScheduleService {
    List<PersonalScheduleDto> scheduleList(Long memberId,String eventType);

    // 일정 등록
    void insertSchedule(Long memberId, PersonalScheduleDto personalScheduleDto);

    // 일정 수정
    void updateSchedule(Long scheduleId, Long memberId, PersonalScheduleDto personalScheduleDto);

    // 일정 삭제
    void deleteSchedule(Long scheduleId, Long memberId);
}
