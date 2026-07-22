package org.spring.backend.store.reservation.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.reservation.dto.TrainerDto;
import org.spring.backend.store.reservation.entity.TrainerEntity;
import org.spring.backend.store.reservation.repository.TrainerRepository;
import org.spring.backend.store.reservation.service.TrainerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class TrainerServiceImpl implements TrainerService {

  private final TrainerRepository trainerRepository;
  private final MemberRepository memberRepository;

  // 회원 ID 기준 트레이너 정보 조회
  @Override
  public TrainerDto getTrainerByMemberId(Long memberId) {
    TrainerEntity trainer = trainerRepository.findByMemberId(memberId)
        .orElseThrow(() -> new IllegalArgumentException("해당 회원의 트레이너 정보를 찾을 수 없습니다."));

    return TrainerDto.toTrainerDto(trainer);
  }

  // 트레이너 프로필 생성 / 등록
  @Override
  @Transactional
  public TrainerDto createTrainer(Long memberId, TrainerDto trainerDto) {
    // 해당 회원이 실제로 존재하는지 확인
    MemberEntity member = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. ID: " + memberId));

    // 이미 트레이너로 등록된 회원인지 중복 검사 (1:1 관계 보호)
    if (trainerRepository.findByMemberId(memberId).isPresent()) {
      throw new IllegalStateException("이미 트레이너로 등록된 회원입니다.");
    }

    // TrainerEntity 객체 생성 (Builder 활용)
    TrainerEntity trainerEntity = TrainerEntity.builder()
        .member(member)
        .career(trainerDto.getCareer())
        .specialty(trainerDto.getSpecialty())
        .introduce(trainerDto.getIntroduce())
        .certificate(trainerDto.getCertificate())
        .profileImage(trainerDto.getProfileImage())
        .build();

    // DB 저장 후 DTO로 변환하여 반환
    TrainerEntity savedTrainer = trainerRepository.save(trainerEntity);
    return TrainerDto.toTrainerDto(savedTrainer);
  }

  // 전체 트레이너 목록 조회
  @Override
  public List<TrainerDto> getAllTrainers() {
    List<TrainerEntity> trainers = trainerRepository.findAll();

    return trainers.stream()
        .map(TrainerDto::toTrainerDto)
        .collect(Collectors.toList());
  }
}
