package org.spring.backend.store.reservation.service;

import org.spring.backend.store.reservation.dto.ReservationDto;

public interface ReservationService {
  // 예약 생성
  Long reservationInsert(ReservationDto reservationDto);
}
