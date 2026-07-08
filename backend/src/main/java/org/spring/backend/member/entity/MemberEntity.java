package org.spring.backend.member.entity;

import jakarta.persistence.*;
import org.spring.backend.common.BasicTime;
import org.spring.backend.common.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.spring.backend.common.Role;
import org.spring.backend.member.dto.MemberDto;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member")
public class MemberEntity extends BasicTime {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "member_id")
  private Long id;

  @Column(unique = true, nullable = false)
  private String userEmail;

  @Column(nullable = false)
  private String userPw;

  @Column(nullable = false)
  private String userName;

  private String userAddress;

  private String userPhone;

  //성별은 공란일시 UNKNOWN으로 자동저장
  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "VARCHAR(25) DEFAULT 'UNKNOWN'")
  private Gender gender;

  private int subscribe;

  @Column(nullable = false)
  private int profilePhoto;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  //멤버의 추가데이터와 1:1매칭
  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "member_add_id")
  private MemberAddEntity memberAddEntity;

  @OneToOne(mappedBy = "memberEntity",
          fetch = FetchType.LAZY, orphanRemoval = true)
  private MemberFileEntity memberFileEntity;

  public static MemberEntity toInsertMemberEntity(MemberDto memberDto, String encodePw){
    return MemberEntity.builder()
            .userEmail(memberDto.getUserEmail())
            .userPw(encodePw)
            .userName(memberDto.getUserName())
            .userAddress(memberDto.getUserAddress())
            .userPhone(memberDto.getUserPhone())
            .gender(memberDto.getGender())
            .subscribe(0)
            .profilePhoto(0)
            .role(Role.MEMBER)
            .build();
  }
  public static MemberEntity toUpdateMemberEntity(MemberDto memberDto, String encodePw){
    return MemberEntity.builder()
            .id(memberDto.getId())
            .userEmail(memberDto.getUserEmail())
            .userPw(encodePw)
            .userName(memberDto.getUserName())
            .userAddress(memberDto.getUserAddress())
            .userPhone(memberDto.getUserPhone())
            .gender(memberDto.getGender())
            .subscribe(memberDto.getSubscribe())
            .profilePhoto(memberDto.getProfilePhoto())
            .role(memberDto.getRole())
            .build();
  }
}
