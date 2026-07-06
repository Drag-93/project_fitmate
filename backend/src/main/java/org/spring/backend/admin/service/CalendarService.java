package org.spring.backend.admin.service;

import org.spring.backend.admin.dto.CalendarDto;

import java.util.List;

public interface CalendarService {
    public List<CalendarDto> calendarListAll();

    public void setCalendar(CalendarDto calendarDto);
}
