package org.spring.backend.member.dto;

import lombok.*;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.entity.MemberFileEntity;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberFileDto {
    private Long id;

    private String newFileName; // 새이름 -> DB, 로컬 저장소 이름

    private String oldFileName; // 원본이름

    private Long memberId;

    private MemberEntity memberEntity;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    public static MemberFileDto memberFileDto(MemberFileEntity memberFileEntity){
        return MemberFileDto.builder()
                .id(memberFileEntity.getId())
                .newFileName(memberFileEntity.getNewFileName())
                .oldFileName(memberFileEntity.getOldFileName())
                .memberId(memberFileEntity.getMemberEntity().getId())
                .memberEntity(memberFileEntity.getMemberEntity())
                .createTime(memberFileEntity.getCreateTime())
                .updateTime(memberFileEntity.getUpdateTime())
                .build();
    }
}
