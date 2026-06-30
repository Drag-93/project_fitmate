package org.spring.backend.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.spring.backend.common.BasicTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member_add")
public class MemberAddEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_add_id")
    private Long id;


    @OneToOne(mappedBy = "memberAddEntity",
    fetch = FetchType.LAZY)
    private MemberEntity memberEntity;
}
