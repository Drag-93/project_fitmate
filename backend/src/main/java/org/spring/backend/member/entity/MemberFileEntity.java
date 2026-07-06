package org.spring.backend.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.spring.backend.common.BasicTime;
import org.spring.backend.member.dto.MemberFileDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member_file_tb")
public class MemberFileEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_file_id")
    private Long id;

    @Column(nullable = false)
    private String newFileName;

    @Column(nullable = false)
    private String oldFileName;

    //1:1
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private MemberEntity memberEntity;

    public static MemberFileEntity toInsertMemberFile(MemberFileDto memberFileDto){
        return MemberFileEntity.builder()
                .newFileName(memberFileDto.getNewFileName())
                .oldFileName(memberFileDto.getOldFileName())
                .memberEntity(memberFileDto.getMemberEntity())
                .build();
    }
}
