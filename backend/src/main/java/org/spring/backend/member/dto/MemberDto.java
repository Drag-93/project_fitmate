package org.spring.backend.member.dto;

import java.time.LocalDateTime;

import org.spring.backend.common.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberAddEntity;
import org.spring.backend.member.entity.MemberEntity;
import org.springframework.web.multipart.MultipartFile;

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

  private MultipartFile memberFile; //실제 파일

  private String newFileName; //새이름 -> DB, 로컬 저장 이름

  private String oldFileName;//원본이름

  private Long memberAddId;

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
            .memberAddId(memberEntity.getMemberAddEntity().getId())
            // 파일 엔티티가 존재할 때만 이름을 넣고, 없으면 null 세팅
            .newFileName(memberEntity.getFileEntities() != null && !memberEntity.getFileEntities().isEmpty() ? memberEntity.getFileEntities().get(0).getNewFileName() : null)
            .oldFileName(memberEntity.getFileEntities() != null && !memberEntity.getFileEntities().isEmpty() ? memberEntity.getFileEntities().get(0).getOldFileName() : null)
            .build();
  }

  public static MemberDto toInitMemberDto(MemberEntity memberEntity){
    return MemberDto.builder()
            .userEmail(memberEntity.getUserEmail())
            .userName(memberEntity.getUserName())
            .gender(memberEntity.getGender())
            .subscribe(memberEntity.getSubscribe())
            .role(memberEntity.getRole())
            .memberAddId(memberEntity.getMemberAddEntity().getId())
            .build();
  }
}
