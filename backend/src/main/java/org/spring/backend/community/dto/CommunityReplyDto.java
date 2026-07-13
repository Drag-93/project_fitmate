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

  private String userName;

  private Long communityId;

  private Long memberId;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  public static CommunityReplyDto toReplyDto(CommunityReplyEntity replyEntity) {
    String userName = "탈퇴한 사용자입니다";

    if (replyEntity.getUserName() != null && !replyEntity.getUserName().isEmpty()) {
      userName = replyEntity.getUserName();
    } else if (replyEntity.getMemberEntity() != null && replyEntity.getMemberEntity().getUserName() != null) {
      userName = replyEntity.getMemberEntity().getUserName();
    }

    Long memberId = null;
    if (replyEntity.getMemberId() != null){
      memberId = replyEntity.getMemberId();
    } else if (replyEntity.getMemberEntity()!=null) {
      memberId = replyEntity.getMemberEntity().getId();
    }

    return CommunityReplyDto.builder()
            .id(replyEntity.getId())
            .content(replyEntity.getContent())
            .userName(userName) // 수정된 로직 적용
            .communityId(replyEntity.getCommunityId())
            .memberId(memberId)
            .createTime(replyEntity.getCreateTime())
            .updateTime(replyEntity.getUpdateTime())
            .build();
  }
}
