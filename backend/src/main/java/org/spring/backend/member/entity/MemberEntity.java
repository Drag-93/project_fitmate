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

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Gender gender;

  @Column(nullable = false)
  private int subscribe;

  @Column(nullable = false)
  private int profilePhoto;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JoinColumn(name = "member_add_id")
  private MemberAddEntity memberAddEntity;

  public static MemberEntity toInsertMemberEntity(MemberDto memberDto){
    return MemberEntity.builder()
            .userEmail(memberDto.getUserEmail())
            .userPw(memberDto.getUserPw())
            .userName(memberDto.getUserName())
            .userAddress(memberDto.getUserAddress())
            .userPhone(memberDto.getUserPhone())
            .gender(memberDto.getGender())
            .subscribe(0)
            .profilePhoto(0)
            .role(Role.MEMBER)
            .build();
  }
  public static MemberEntity toUpdateMemberEntity(MemberDto memberDto){
    return MemberEntity.builder()
            .id(memberDto.getId())
            .userEmail(memberDto.getUserEmail())
            .userPw(memberDto.getUserPw())
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
