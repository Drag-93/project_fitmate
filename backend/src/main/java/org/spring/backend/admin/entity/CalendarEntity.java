package org.spring.backend.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.spring.backend.member.entity.MemberEntity;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "calendar")
public class CalendarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="calendar_id")
    private Integer id;

    @Column(nullable = false)
    private String content;

    //일정 시작시간
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP) //날짜와 시간을 모두 저장
    private Date start;

    //일정 종료시간
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date end;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name="member_id")
//    private MemberEntity memberEntity;

}
