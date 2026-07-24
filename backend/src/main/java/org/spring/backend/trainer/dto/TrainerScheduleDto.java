package org.spring.backend.trainer.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.reservation.type.ScheduleStatus;
import org.spring.backend.trainer.entity.TrainerScheduleEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class TrainerScheduleDto {

  private Long id;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  private ScheduleStatus status;

  private Long trainerId;

  private String trainerName;

  public static TrainerScheduleDto toDto(TrainerScheduleEntity entity) {

    return TrainerScheduleDto.builder()
        .id(entity.getId())
        .startTime(entity.getStartTime())
        .endTime(entity.getEndTime())
        .status(entity.getStatus())
        .trainerId(entity.getTrainer().getId())
        .trainerName(
            entity.getTrainer()
                .getMember()
                .getUserName())
        .build();
  }

}