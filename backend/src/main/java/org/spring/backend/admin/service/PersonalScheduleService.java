package org.spring.backend.admin.service;

import org.spring.backend.admin.dto.PersonalScheduleDto;

import java.util.List;

public interface PersonalScheduleService {
    public List<PersonalScheduleDto> calendarListAll();

    public void setCalendar(PersonalScheduleDto personalScheduleDto);
}
