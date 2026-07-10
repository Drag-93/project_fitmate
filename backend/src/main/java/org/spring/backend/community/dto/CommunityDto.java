package org.spring.backend.community.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.FileEntity;
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

  private String userName;

  private String title;

  private String content;

  private Long categoryId;

  private int reply;

  private MultipartFile attachFile;

  private int hasFile;

  private LocalDateTime createTime;
  
  private LocalDateTime updateTime;

  private int hit;

  private String originalFileName;

  private String categoryName;

  private String tabName;

  private List<FileEntity> fileEntity;

  public CommunityDto(CommunityEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.userName = entity.getUserName();
        this.content = entity.getContent();
        this.createTime = entity.getCreateTime();
        this.updateTime = entity.getUpdateTime();
    }
}
