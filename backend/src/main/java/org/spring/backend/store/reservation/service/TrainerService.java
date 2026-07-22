package org.spring.backend.store.reservation.service;

import java.util.List;

import org.spring.backend.store.reservation.dto.TrainerDto;

public interface TrainerService {

  public TrainerDto getTrainerByMemberId(Long memberId);

  public TrainerDto createTrainer(Long memberId, TrainerDto trainerDto);
  // 전체 트레이너 조회
  List<TrainerDto> getAllTrainers();
}
