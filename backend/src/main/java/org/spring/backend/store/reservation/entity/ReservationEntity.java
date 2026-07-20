package org.spring.backend.store.reservation.entity;

import java.time.LocalDateTime;

import org.spring.backend.common.BasicTime;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.reservation.type.ReservationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "reservation_tb")
public class ReservationEntity extends BasicTime {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "reservation_id")
  private Long id;

  @Column(nullable = false)
  private LocalDateTime reservationTime; // 예약 날짜

  private ReservationStatus reservationStatus; // RESERVED, COMPLETE, CANCEL

  @Column(length = 500)
  private String memo; // 요청사항

  @ManyToOne
  @JoinColumn(name = "member_id", nullable = false)
  private MemberEntity member;

  @ManyToOne
  @JoinColumn(name = "trainer_id", nullable = false)
  private MemberEntity trainer;
}
