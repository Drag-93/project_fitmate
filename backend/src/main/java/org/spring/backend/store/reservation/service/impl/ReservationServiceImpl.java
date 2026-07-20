package org.spring.backend.store.reservation.service.impl;

import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.reservation.dto.ReservationDto;
import org.spring.backend.store.reservation.entity.ReservationEntity;
import org.spring.backend.store.reservation.repository.ReservationRepository;
import org.spring.backend.store.reservation.service.ReservationService;
import org.spring.backend.store.reservation.type.ReservationStatus;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReservationServiceImpl implements ReservationService {

  private final ReservationRepository reservationRepository;
  private final MemberRepository memberRepository;

  @Override
  public Long reservationInsert(ReservationDto reservationDto) {
    MemberEntity member = memberRepository.findById(
        reservationDto.getMemberId())
        .orElseThrow(() -> new IllegalArgumentException("회원이 없습니다."));

    MemberEntity trainer = memberRepository.findById(
        reservationDto.getTrainerId())
        .orElseThrow(() -> new IllegalArgumentException("트레이너가 없습니다."));

    if (trainer.getRole() != Role.TRAINER) {
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
}
