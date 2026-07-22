package org.spring.backend.store.reservation.controller;

import java.util.List;

import org.spring.backend.store.reservation.dto.TrainerDto;
import org.spring.backend.store.reservation.service.TrainerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trainer")
public class TrainerController {

  private final TrainerService trainerService;

  // 회원 id로 트레이너 정보 조회
  @GetMapping("/{memberId}")
  public TrainerDto getTrainer(
      @PathVariable Long memberId) {

    return trainerService.getTrainerByMemberId(memberId);
  }
  @GetMapping("/list")
    public ResponseEntity<List<TrainerDto>> getTrainerList() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }

}