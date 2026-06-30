package org.spring.backend.community.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.spring.backend.common.BasicTime;

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

    private String writerName;

    private String title;

    private String content;

    private String reply;

    private int hasFile;

    private int hit;

    private String originalFileName;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id")
   private CategoryEntity categoryEntity;

     @OneToMany(mappedBy = "communityEntity", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FileEntity> fileEntity = new ArrayList<>();
}
