package org.spring.backend.community.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.member.entity.MemberEntity;
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

  private String categoryName;

  private String tabName;

  private int reply;

    private String userEmail;

  private MultipartFile attachFile;

  private int hasFile;

  private LocalDateTime createTime;
  
  private LocalDateTime updateTime;

  private int hit;

  private String originalFileName;

  private Long tabId;



  private MemberEntity memberEntity;

  private CategoryEntity categoryEntity;

  public CommunityDto(CommunityEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.userName = entity.getUserName();
        this.content = entity.getContent();
        this.createTime = entity.getCreateTime();
        this.updateTime = entity.getUpdateTime();
        this.categoryId=entity.getCategoryEntity().getId();
        this.categoryName=entity.getCategoryEntity().getCategoryName();
        this.hit= entity.getHit();
        this.tabId=entity.getCategoryEntity().getTabEntity().getId();
        this.tabName=entity.getCategoryEntity().getTabEntity().getTabName();
        this.reply= entity.getReply();
        this.memberEntity=entity.getMemberEntity();
    }
}
