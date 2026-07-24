package org.spring.backend.shop.reservation.repository;

import java.time.LocalDate;
import java.util.List;

import org.spring.backend.shop.reservation.entity.ReservationEntity;
import org.spring.backend.shop.reservation.type.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
  @Query("""
      select r
      from ReservationEntity r
      join fetch r.member
      join fetch r.trainer t
      join fetch t.member
      """)
  List<ReservationEntity> findAllWithMemberAndTrainer();

  List<ReservationEntity> findByTrainerId(Long trainerId);

  List<ReservationEntity> findByMemberId(Long memberId);

  List<ReservationEntity>
  findByTrainer_IdAndReservationDateAndReservationStatus(
      Long trainerId,
      LocalDate reservationDate,
      ReservationStatus reservationStatus);
}
