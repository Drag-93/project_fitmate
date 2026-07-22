package org.spring.backend.store.reservation.repository;

import java.util.Optional;

import org.spring.backend.store.reservation.entity.TrainerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<TrainerEntity, Long> {

  Optional<TrainerEntity> findByMemberId(Long memberId);
}
