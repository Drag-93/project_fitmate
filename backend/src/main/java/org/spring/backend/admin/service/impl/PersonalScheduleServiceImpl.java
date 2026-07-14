package org.spring.backend.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.dto.PersonalScheduleDto;
import org.spring.backend.admin.entity.PersonalScheduleEntity;
import org.spring.backend.admin.repository.PersonalScheduleRepository;
import org.spring.backend.admin.service.PersonalScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalScheduleServiceImpl implements PersonalScheduleService {

    private final PersonalScheduleRepository personalScheduleRepository;

    //전체 일정 조회
    @Override
    @Transactional(readOnly = true) // 단순 조회 시 성능 최적화를 위해 추가
    public List<PersonalScheduleDto> calendarListAll() {
        return personalScheduleRepository.findAll().stream()
                .map(personalScheduleEntity -> PersonalScheduleDto.builder()
                        .id(personalScheduleEntity.getId())
                        .start(personalScheduleEntity.getStart())
                        .content(personalScheduleEntity.getContent())
                        .end(personalScheduleEntity.getEnd())
                        .build())
                .collect(Collectors.toList());
    }
    //일정 등록
    @Override
    @Transactional
    public void setCalendar(PersonalScheduleDto personalScheduleDto) {
        PersonalScheduleEntity personalScheduleEntity = PersonalScheduleEntity.builder()
                .start(personalScheduleDto.getStart())
                .end(personalScheduleDto.getEnd())
                .content(personalScheduleDto.getContent())
                .build();

        personalScheduleRepository.save(personalScheduleEntity);
    }
}
