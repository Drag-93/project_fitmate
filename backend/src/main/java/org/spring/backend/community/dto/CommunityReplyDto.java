package org.spring.backend.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.spring.backend.community.entity.CommunityReplyEntity;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommunityReplyDto {
  private Long id;

  private String emoticon;

  private String content;

  private String writerName;

  private Long communityId;

  private Long memberId;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static CommunityReplyDto toReplyDto(CommunityReplyEntity replyEntity) {
    return CommunityReplyDto.builder()
            .id(replyEntity.getId())
            .content(replyEntity.getContent())
            .writerName(replyEntity.getWriterName())
            .communityId(replyEntity.getCommunityId())
            .memberId(replyEntity.getMemberId())
            .createTime(replyEntity.getCreateTime())
            .updateTime(replyEntity.getUpdateTime())
            .build();
  }
}
