package org.spring.backend.community.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.spring.backend.common.BasicTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
import org.spring.backend.member.entity.MemberEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "community_reply_tb")
public class CommunityReplyEntity extends BasicTime {
  @Id
  @Column(name = "community_reply_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String content;

    private int emoticon;

    @Column(name = "community_id", insertable = false, updatable = false)
    private Long communityId;

    @Column(name = "member_id", insertable = false, updatable = false)
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="community_id")
    private CommunityEntity communityEntity;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id")
  private MemberEntity memberEntity;

}
