package org.spring.backend.store.review.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ReviewDto {
  private Long id;
  private int rating;

  private String content;

  private Long memberId;

  private Long productId;

  private Long orderItemId;

  private String memberNickname;

  private LocalDateTime createTime;
  private LocalDateTime updateTime;
}
