package org.spring.backend.store.reservation.repository;

import java.util.List;

import org.spring.backend.store.reservation.entity.ReservationEntity;
import org.spring.backend.store.reservation.entity.TrainerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TrainerRepository extends JpaRepository<TrainerEntity, Long> {

}
