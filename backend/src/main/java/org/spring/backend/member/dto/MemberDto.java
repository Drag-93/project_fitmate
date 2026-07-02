package org.spring.backend.member.dto;

import java.time.LocalDateTime;

import org.spring.backend.common.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {
  private Long id;

  private String userEmail;

  private String userPw;

  private String userName;

  private String userAddress;

  private String userPhone;

  private Gender gender;

  private int subscribe;

  private int profilePhoto;

  private Role role;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static MemberDto toMemberDto(MemberEntity memberEntity){
    return MemberDto.builder()
            .id(memberEntity.getId())
            .userEmail(memberEntity.getUserEmail())
            .userPw(memberEntity.getUserPw())
            .userName(memberEntity.getUserName())
            .userAddress(memberEntity.getUserAddress())
            .userPhone(memberEntity.getUserPhone())
            .gender(memberEntity.getGender())
            .subscribe(memberEntity.getSubscribe())
            .profilePhoto(memberEntity.getProfilePhoto())
            .role(memberEntity.getRole())
            .createTime(memberEntity.getCreateTime())
            .updateTime(memberEntity.getUpdateTime())
            .build();
  }
}
