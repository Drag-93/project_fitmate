package org.spring.backend.admin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "personalSchedule_tb")
public class PersonalScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="personalSchedule_id")
    private Integer id;

    @Column(nullable = false)
    private String content;

    //일정 시작시간
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP) //날짜와 시간을 모두 저장
    private LocalDateTime start;

    //일정 종료시간
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime end;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name="member_id")
//    private MemberEntity memberEntity;

}
