package org.spring.backend.community.entity;

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

    private String writerName;

    private String content;

    private int emoticon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="community_id")
    private CommunityEntity communityEntity;
}
