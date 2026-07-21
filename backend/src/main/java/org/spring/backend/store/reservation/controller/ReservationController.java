package org.spring.backend.store.reservation.controller;

import org.spring.backend.store.reservation.dto.ReservationDto;
import org.spring.backend.store.reservation.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservation")
public class ReservationController {

  private final ReservationService reservationService;

  // 예약 생성
  @PostMapping
  public ResponseEntity<Long> reservationInsert(
      @RequestBody ReservationDto reservationDto) {
    Long reservationId = reservationService.reservationInsert(reservationDto);
    return ResponseEntity.ok(reservationId);
  }

  // POST /api/reservation // 예약 생성
  // GET /api/reservation/member // 내 예약 목록
  // GET /api/reservation/trainer // 트레이너 예약 목록
  // GET /api/reservation/{id} // 예약 상세
  // PUT /api/reservation/{id}/cancel // 예약 취소
  // PUT /api/reservation/{id}/complete // PT 완료
  // GET /api/reservation/date // 날짜별 예약 조회
}