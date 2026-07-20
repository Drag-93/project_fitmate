package org.spring.backend.store.reservation.service.impl;

import java.util.List;

import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.reservation.dto.ReservationDto;
import org.spring.backend.store.reservation.entity.ReservationEntity;
import org.spring.backend.store.reservation.entity.TrainerEntity;
import org.spring.backend.store.reservation.repository.ReservationRepository;
import org.spring.backend.store.reservation.repository.TrainerRepository;
import org.spring.backend.store.reservation.service.ReservationService;
import org.spring.backend.store.reservation.type.ReservationStatus;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReservationServiceImpl implements ReservationService {

  private final ReservationRepository reservationRepository;
  private final MemberRepository memberRepository;
  private final TrainerRepository trainerRepository;

  // 예약 생성
  @Override
  public Long reservationInsert(ReservationDto reservationDto) {
    // 예약자
    MemberEntity member = memberRepository.findById(
        reservationDto.getMemberId())
        .orElseThrow(() -> new IllegalArgumentException("회원이 없습니다."));

    // 담당 트레이너
    TrainerEntity trainer = trainerRepository.findById(
        reservationDto.getTrainerId())
        .orElseThrow(() -> new IllegalArgumentException("트레이너를 찾을 수 없습니다."));

    // 트레이너인지 확인
    if (trainer.getMember().getRole() != Role.TRAINER) {
      throw new IllegalArgumentException("트레이너가 아닙니다.");
    }

    ReservationEntity reservation = ReservationEntity.builder()
        .reservationTime(reservationDto.getReservationTime())
        .reservationStatus(ReservationStatus.RESERVED)
        .memo(reservationDto.getMemo())
        .member(member)
        .trainer(trainer)
        .build();

    reservationRepository.save(reservation);

    return reservation.getId();
  }



  // 트레이너 예약 목록
  @Override
  public List<ReservationDto> getTrainerReservation(Long trainerId) {

    List<ReservationEntity> reservations = reservationRepository.findByTrainerId(trainerId);

    return reservations.stream()
        .map(ReservationDto::toReservationDto)
        .toList();
  }

  @Override
  public List<ReservationDto> getMemberReservation(Long memberId) {
    return List.of();
  }
  @Override
  public void updateReservation(Long reservationId, ReservationDto reservationDto, Long memberId) {

  }

  @Override
  public void cancelTrainerReservation(Long reservationId, Long trainerId) {

  }

  // 회원용 예약 상태 변경
  @Override
  @Transactional
  public void cancelMemberReservation(Long reservationId, Long memberId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new IllegalArgumentException("예약이 없습니다."));

    // 본인 예약인지 확인
    if (!reservation.getMember().getId().equals(memberId)) {
      throw new IllegalArgumentException("본인의 예약만 취소 가능합니다.");
    }

    if (reservation.getReservationStatus() == ReservationStatus.COMPLETE) {
      throw new IllegalArgumentException("완료된 예약은 취소할 수 없습니다.");
    }

    reservation.setReservationStatus(
        ReservationStatus.CANCEL);
  }

  // 트레이너용 예약 상태 변경
  @Override
  @Transactional
  public void updateStatus(Long reservationId,ReservationStatus status,Long trainerId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow();

    // 담당 트레이너인지 확인
    if (!reservation.getTrainer().getId().equals(trainerId)) {
      throw new IllegalArgumentException("담당 트레이너만 변경 가능합니다.");
    }

    reservation.setReservationStatus(status);
  }
}
