package org.spring.backend.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.dto.PersonalScheduleDto;
import org.spring.backend.admin.entity.PersonalScheduleEntity;
import org.spring.backend.admin.repository.PersonalScheduleRepository;
import org.spring.backend.admin.service.PersonalScheduleService;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.file.repository.FileRepository;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalScheduleServiceImpl implements PersonalScheduleService {

    private final PersonalScheduleRepository personalScheduleRepository;
    private final MemberRepository memberRepository;

//  파일 추가시 활성화
//   private final FileRepository fileRepository;
//   private final FileHandler fileHandler;
//    // 스케줄 이미지 저장 경로
//    @Value("${img.path.schedule}")
//    private String schedulePath;

    // 전체 일정 조회
    @Override
    @Transactional(readOnly = true)
    public List<PersonalScheduleDto> scheduleList(Long memberId,String eventType){
        List<PersonalScheduleDto> scheduleList = new ArrayList<>();

        if (eventType == null || eventType.isBlank()) {
            throw new IllegalArgumentException("eventType이 입력되지 않았습니다.");
        }
        switch (eventType.toUpperCase()) {
            case "ALL" -> {
                // 추후 연결
                // scheduleList.addAll(getSubscription(memberId));
                // scheduleList.addAll(getPt(memberId));
                scheduleList.addAll(getPersonalSchedule(memberId, "WORKOUT"));
                scheduleList.addAll(getPersonalSchedule(memberId, "PERSONAL"));
            }
            case "SUBSCRIPTION"
                    -> scheduleList.addAll(getSubscription(memberId));

            case "PT"
                    -> scheduleList.addAll(getPt(memberId));

            case "WORKOUT"
                    -> scheduleList.addAll(getPersonalSchedule(memberId, "WORKOUT"));

            case "PERSONAL"
                    -> scheduleList.addAll(getPersonalSchedule(memberId, "PERSONAL"));

            default
                    -> throw new IllegalArgumentException("지원하지 않는 eventType입니다: " + eventType);
        }

        return scheduleList;
    }

    // 사용자가 직접 등록한(WORKOUT,PERSONAL) 일정 조회
    private List<PersonalScheduleDto> getPersonalSchedule(Long memberId,String eventType) {
        return personalScheduleRepository
                .findByMemberEntityIdAndEventType(memberId, eventType)
                .stream()
                .map(entity -> {
                    FileEntity fileEntity = entity.getFileEntities().isEmpty()
                            ? null
                            : entity.getFileEntities().get(0);

                    return PersonalScheduleDto.toPersonalScheduleDto(entity,fileEntity);
                })
                .toList();
    }

    // 구독 일정 조회 (editable=false)
    private List<PersonalScheduleDto> getSubscription(Long memberId) {
        // 추후 SubscriptionRepository 연결
        return new ArrayList<>();
    }

    // PT 일정 조회 (editable=false) trainer는 가능?
    private List<PersonalScheduleDto> getPt(Long memberId) {
        // 추후 PtRepository 연결
        return new ArrayList<>();
    }

// 파일 추가시 활성화
//    // PersonalScheduleEntity와 해당 스케줄의 FileEntity를 함께 조회
//    // PersonalScheduleDto로 변환하는 공통 메서드
//    private PersonalScheduleDto convertPersonalScheduleDto(PersonalScheduleEntity personalScheduleEntity) {
//
//        FileEntity fileEntity =
//                fileRepository
//                        .findByPersonalScheduleEntity(personalScheduleEntity)
//                        .orElse(null);
//
//        return PersonalScheduleDto.toPersonalScheduleDto(
//                personalScheduleEntity,
//                fileEntity
//        );
//    }


    // 일정 등록
    @Transactional
    @Override
    public void insertSchedule(Long memberId, PersonalScheduleDto personalScheduleDto) {
        // 등록 가능한 eventType인지 확인
        validateEventType(personalScheduleDto.getEventType());
        // 시작일과 종료일 확인
        validateScheduleTime(personalScheduleDto);

        MemberEntity memberEntity = memberRepository
                .findById(memberId).orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));

        PersonalScheduleEntity personalScheduleEntity =
                PersonalScheduleEntity.toInsertPersonalScheduleEntity(personalScheduleDto,memberEntity);

        //파일 추가시 삭제
        personalScheduleRepository.save(personalScheduleEntity);
        
//   파일 추가시 활성화
//        // 실제 파일이 존재할 때만 파일 저장
//        PersonalScheduleEntity savedSchedule=
//        personalScheduleRepository.save(personalScheduleEntity);
//        if (personalScheduleDto.getAttachFile() != null
//                && !personalScheduleDto.getAttachFile().isEmpty()) {
//
//            fileHandler.insertFile(
//                    schedulePath,
//                    TableType.schedule,
//                    savedSchedule.getId(),
//                    personalScheduleDto.getAttachFile()
//            );
    }

    // 일정 수정
    @Transactional
    @Override
    public void updateSchedule(Long scheduleId, Long memberId, PersonalScheduleDto personalScheduleDto
    ) {
        // 수정 가능한 eventType인지 확인
        validateEventType(personalScheduleDto.getEventType());
        // 시작일과 종료일 확인
        validateScheduleTime(personalScheduleDto);

        PersonalScheduleEntity personalScheduleEntity =
                personalScheduleRepository.findById(scheduleId)
                        .orElseThrow(() -> new IllegalArgumentException("일정 정보가 없습니다."));

        // 본인이 등록한 일정인지 확인
        if (!personalScheduleEntity.getMemberEntity().getId().equals(memberId)) {
            throw new IllegalArgumentException("일정을 수정할 권한이 없습니다.");
        }

        personalScheduleEntity.toUpdate(personalScheduleDto);

//  파일 추가시 활성화
//        // 새 이미지가 선택된 경우에만 파일 교체
//        if (personalScheduleDto.getAttachFile() != null
//                && !personalScheduleDto.getAttachFile().isEmpty()) {

//            // 기존 파일이 존재하면 실제 파일과 FileEntity 삭제
//            Optional<FileEntity> oldFileEntity =
//                    fileRepository
//                            .findByPersonalScheduleEntity(personalScheduleEntity);
//
//            fileHandler.insertFile(
//                    schedulePath,
//                    TableType.schedule,
//                    savedSchedule.getId(),
//                    personalScheduleDto.getAttachFile()
//            );
//    }
    }

    // 일정 삭제
    @Transactional
    @Override
    public void deleteSchedule(Long scheduleId, Long memberId) {

        PersonalScheduleEntity personalScheduleEntity =
                personalScheduleRepository.findById(scheduleId).orElseThrow(
                        () -> new IllegalArgumentException("일정 정보가 없습니다."));

        // 본인이 등록한 일정인지 확인
        if (!personalScheduleEntity.getMemberEntity().getId().equals(memberId)) {
            throw new IllegalArgumentException("일정을 삭제할 권한이 없습니다.");
        }

//      파일 추가시 활성화
//        //실제 저장 파일과 FileEntity 삭제
//        Optional<FileEntity> fileEntity=fileRepository.findByPersonalScheduleEntity(personalScheduleEntity);
//        if(fileEntity.isPresent()){
//
//            fileHandler.deleteFile(
//                    schedulePath,
//                    TableType.schedule,
//                    scheduleId);
//        }
        personalScheduleRepository.delete(personalScheduleEntity);
    }
    // 등록 또는 수정 가능한 일정 유형 검증
    private void validateEventType(String eventType) {
        if (!"WORKOUT".equalsIgnoreCase(eventType) && !"PERSONAL".equalsIgnoreCase(eventType)) {
            throw new IllegalArgumentException(
                    "직접 등록 가능한 일정 유형은 WORKOUT 또는 PERSONAL입니다.");
        }
    }


    // 일정 시작일과 종료일 검증
    private void validateScheduleTime(PersonalScheduleDto personalScheduleDto){
        if (personalScheduleDto.getStart() == null|| personalScheduleDto.getEnd() == null) {
            throw new IllegalArgumentException("일정 시작일과 종료일은 필수입니다.");
        }
        if (personalScheduleDto.getEnd().isBefore(personalScheduleDto.getStart())) {
            throw new IllegalArgumentException("일정 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

}