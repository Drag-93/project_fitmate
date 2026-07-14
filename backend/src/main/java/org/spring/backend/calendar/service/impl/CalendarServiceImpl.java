package org.spring.backend.calendar.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.calendar.dto.CalendarDto;
import org.spring.backend.calendar.service.CalendarService;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {

    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CalendarDto> getCalendar(Long memberId, String eventType){

        // 회원 존재 여부 확인
        MemberEntity memberEntity = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("회원 정보가 없습니다."));

        // eventType에 따라 조회할 일정 분기
        switch (eventType.toUpperCase()) {
            // 전체 일정 조회
            case "ALL":
                return getAllCalendar(memberId);
            // 구독 일정 조회
            case "SUBSCRIPTION":
                return getSubscription(memberId);
            // PT 일정 조회
            case "PT":
                return getPt(memberId);
            // 운동 기록 조회
            case "WORKOUT":
                return getWorkout(memberId);
            // 개인 일정 조회
            case "PERSONAL":
                return getPersonalSchedule(memberId);
            // 잘못된 eventType
            default:
                throw new IllegalArgumentException("잘못된 일정 종류입니다.");
        }
    }

    // 전체 일정 조회
    //추후 권한(회원/트레이너/관리자)에 따라 조회 대상이 달라질 경우 이 메서드에서 분기 예정
    private List<CalendarDto> getAllCalendar(Long memberId) {
        List<CalendarDto> calendarList = new ArrayList<>();

        calendarList.addAll(getSubscription(memberId));
        calendarList.addAll(getPt(memberId));
        calendarList.addAll(getWorkout(memberId));
        calendarList.addAll(getPersonalSchedule(memberId));

        return calendarList;
    }

    //구독 상품 일정 조회
    //이용권 시작일 이용권 종료일
    private List<CalendarDto> getSubscription(Long memberId) {
        return new ArrayList<>();
    }

    // PT 일정 조회
    // 현재는 회원 기준 조회
    // 추후 Trainer 기능 추가 시 권한(Role)에 따라 조회 방식 분기 예정
    private List<CalendarDto> getPt(Long memberId) {
        return new ArrayList<>();
    }

    // 운동 기록 일정 조회
    private List<CalendarDto> getWorkout(Long memberId) {
        return new ArrayList<>();
    }

    // 회원이(트레이너가) 직접 등록한 개인 일정 조회
    private List<CalendarDto> getPersonalSchedule(Long memberId) {
        return new ArrayList<>();
    }
}