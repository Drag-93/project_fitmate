package org.spring.backend.store.reservation.repository;

import org.spring.backend.store.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>{
  
}
