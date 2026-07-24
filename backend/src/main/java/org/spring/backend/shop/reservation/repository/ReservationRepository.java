package org.spring.backend.store.reservation.repository;

import java.util.List;

import org.spring.backend.store.reservation.entity.ReservationEntity;
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

}
