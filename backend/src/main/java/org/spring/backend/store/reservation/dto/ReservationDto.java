package org.spring.backend.store.reservation.dto;

import java.time.LocalDateTime;

import org.spring.backend.store.reservation.entity.ReservationEntity;
import org.spring.backend.store.reservation.type.ReservationStatus;

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
public class ReservationDto {

  private Long id;

  private LocalDateTime reservationTime;

  private ReservationStatus reservationStatus;

  private String memo;

  private Long memberId;
  private String memberName;

  private Long trainerId;
  private String trainerName;

  public static ReservationDto toReservationDto(
      ReservationEntity entity) {

    return ReservationDto.builder()
        .id(entity.getId())
        .reservationTime(entity.getReservationTime())
        .reservationStatus(entity.getReservationStatus())
        .memo(entity.getMemo())
        .memberId(entity.getMember().getId())
        .memberName(entity.getMember().getUserName())
        .trainerId(entity.getTrainer().getId())
        .trainerName(entity.getTrainer().getUserName())
        .build();
  }
}
