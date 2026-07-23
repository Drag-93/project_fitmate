package org.spring.backend.store.reservation.service.impl;

import java.util.List;

import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.MemberProduct.entity.MemberProductEntity;
import org.spring.backend.store.MemberProduct.repository.MemberProductRepository;
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
  private final MemberProductRepository memberProductRepository;
  private final TrainerRepository trainerRepository;

  // 회원 예약 생성
  @Override
  @Transactional
  public Long reservationInsert(ReservationDto reservationDto) {

    MemberEntity member = memberRepository.findById(
        reservationDto.getMemberId())
        .orElseThrow(() -> new IllegalArgumentException("회원이 없습니다."));

    TrainerEntity trainer = trainerRepository.findById(
        reservationDto.getTrainerId())
        .orElseThrow(() -> new IllegalArgumentException("트레이너를 찾을 수 없습니다."));

    if (trainer.getMember().getRole() != Role.TRAINER) {
      throw new IllegalArgumentException("트레이너가 아닙니다.");
    }

    MemberProductEntity memberProduct = memberProductRepository.findById(reservationDto.getMemberProductId())
        .orElseThrow(() -> new IllegalArgumentException("이용권 없음"));

    if (!memberProduct.getMemberEntity().getId().equals(member.getId())) {
      throw new IllegalArgumentException("본인의 이용권만 사용할 수 있습니다.");
    }

    if (memberProduct.getRemainingCount() <= 0) {
      throw new IllegalArgumentException("잔여 횟수 없음");
    }

    memberProduct.setRemainingCount(
        memberProduct.getRemainingCount() - 1);
    ReservationEntity reservation = ReservationEntity.builder()
        .reservationDate(reservationDto.getReservationDate())
        .reservationTime(reservationDto.getReservationTime())
        .reservationStatus(ReservationStatus.RESERVED)
        .memo(reservationDto.getMemo())
        .member(member)
        .trainer(trainer)
        .memberProduct(memberProduct)
        .build();

    reservationRepository.save(reservation);

    return reservation.getId();
  }

  // 회원용 예약 조회
  @Override
  public List<ReservationDto> getMemberReservation(Long memberId) {

    List<ReservationEntity> reservations = reservationRepository.findByMemberId(memberId);

    return reservations.stream()
        .map(ReservationDto::toReservationDto)
        .toList();
  }

  // 트레이너용 예약 조회
  @Override
  public List<ReservationDto> getTrainerReservation(Long trainerId) {

    List<ReservationEntity> reservations = reservationRepository.findByTrainerId(trainerId);

    return reservations.stream()
        .map(ReservationDto::toReservationDto)
        .toList();
  }

  // 회원 예약 시간 변경
  @Override
  @Transactional
  public void updateReservation(
      Long reservationId,
      ReservationDto reservationDto,
      Long memberId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new IllegalArgumentException("예약이 없습니다."));

    // 본인 예약 확인
    if (!reservation.getMember().getId().equals(memberId)) {
      throw new IllegalArgumentException("본인의 예약만 변경 가능합니다.");
    }

    if (reservation.getReservationStatus() != ReservationStatus.RESERVED) {
      throw new IllegalArgumentException("변경할 수 없는 예약입니다.");
    }

    reservation.setReservationTime(
        reservationDto.getReservationTime());

  }

  // 회원 예약 취소
  @Override
  @Transactional
  public void cancelMemberReservation(
      Long reservationId,
      Long memberId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new IllegalArgumentException("예약이 없습니다."));

    if (!reservation.getMember().getId().equals(memberId)) {
      throw new IllegalArgumentException("본인의 예약만 취소 가능합니다.");
    }

    if (reservation.getReservationStatus() == ReservationStatus.COMPLETE) {

      throw new IllegalArgumentException(
          "완료된 예약은 취소할 수 없습니다.");
    }

    reservation.setReservationStatus(
        ReservationStatus.CANCEL);
  }

  // 트레이너 예약 상태 변경
  @Override
  @Transactional
  public void updateStatus(
      Long reservationId,
      ReservationStatus status,
      Long trainerId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new IllegalArgumentException("예약이 없습니다."));

    if (!reservation.getTrainer().getId().equals(trainerId)) {
      throw new IllegalArgumentException(
          "담당 트레이너만 변경 가능합니다.");
    }

    reservation.setReservationStatus(status);

  }

  // 트레이너 예약 취소
  @Override
  @Transactional
  public void cancelTrainerReservation(
      Long reservationId,
      Long trainerId) {

    ReservationEntity reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new IllegalArgumentException("예약이 없습니다."));

    if (!reservation.getTrainer().getId().equals(trainerId)) {
      throw new IllegalArgumentException(
          "담당 트레이너만 취소 가능합니다.");
    }

    reservation.setReservationStatus(
        ReservationStatus.CANCEL);

  }

}