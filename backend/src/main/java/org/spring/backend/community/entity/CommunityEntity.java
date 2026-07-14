package org.spring.backend.community.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.spring.backend.common.BasicTime;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.member.entity.MemberEntity;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "community_tb")
public class CommunityEntity extends BasicTime {
  @Id
  @Column(name = "community_id")
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String title;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    private Long tabId;

    private String categoryName;

    private String tabName;

    private String userEmail;

    private int reply;

    private int hasFile;

    private int hit;

    private String originalFileName;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id")
    private CategoryEntity categoryEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private MemberEntity memberEntity;

    @OneToMany(mappedBy = "communityEntity",cascade = CascadeType.ALL,orphanRemoval= true)
    private List<CommunityReplyEntity> communityReplyEntity = new ArrayList<>();

    //파일엔티티와 1:N 매핑
    @OneToMany(mappedBy = "communityEntity",
    fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<FileEntity> fileEntities;
}
