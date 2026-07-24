package org.spring.backend.trainer.controller;

import java.util.List;

import org.spring.backend.trainer.dto.TrainerScheduleDto;
import org.spring.backend.trainer.service.TrainerScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservation/trainer/schedule")
public class TrainerScheduleController {

  private final TrainerScheduleService trainerScheduleService;

  // 트레이너 스케줄 등록
  @PostMapping
  public ResponseEntity<Long> insertSchedule(
      @RequestParam Long trainerId,
      @RequestBody TrainerScheduleDto dto) {

    Long id = trainerScheduleService.insertSchedule(
        dto,
        trainerId);

    return ResponseEntity.ok(id);
  }

  // 트레이너 스케줄 조회
  @GetMapping("/{trainerId}")
  public ResponseEntity<List<TrainerScheduleDto>> getSchedule(
      @PathVariable Long trainerId) {

    List<TrainerScheduleDto> list = trainerScheduleService.getTrainerSchedule(
        trainerId);

    return ResponseEntity.ok(list);
  }

  // 스케줄 삭제
  @DeleteMapping("/{scheduleId}")
  public ResponseEntity<Void> deleteSchedule(
      @PathVariable Long scheduleId,
      @RequestParam Long trainerId) {

    trainerScheduleService.deleteSchedule(
        scheduleId,
        trainerId);

    return ResponseEntity.ok().build();
  }

  // 스케줄 상태 변경 (가능 ↔ 휴무)
  @PutMapping("/{scheduleId}/status")
  public ResponseEntity<Void> updateStatus(
      @PathVariable Long scheduleId,
      @RequestParam Long trainerId) {

    trainerScheduleService.updateStatus(
        scheduleId,
        trainerId);

    return ResponseEntity.ok().build();
  }

}