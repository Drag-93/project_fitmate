package org.spring.backend.community.dto;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommunityDto {
  private Long id;

  private String writerName;

  private String title;

  private String content;

  private String reply;

  private MultipartFile attachFile;

  private int hasFile;

  private LocalDateTime createTime;
  
  private LocalDateTime updateTime;

  private int hit;

      private String originalFileName;

}
