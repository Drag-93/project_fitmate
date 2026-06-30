package org.spring.backend.community.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import org.spring.backend.common.BasicTime;

@Builder
@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="file_tb")
@ToString
public class FileEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="file_id")
    private Long id;

    @Column(nullable = false)
    private String newFileName;
    @Column(nullable = false)
    private String oldFileName;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="community_id")
    private CommunityEntity communityEntity;
}