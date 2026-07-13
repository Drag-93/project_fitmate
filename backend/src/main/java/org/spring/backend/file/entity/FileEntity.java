package org.spring.backend.file.entity;

import jakarta.persistence.*;
import lombok.*;
import org.spring.backend.common.BasicTime;
import org.spring.backend.common.TableType;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.member.entity.MemberEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "file_tb")
public class FileEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_file_id")
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TableType tableType;

    private String category;

    @Column(nullable = false)
    private String newFileName;

    @Column(nullable = false)
    private String oldFileName;

    //N:1 멤버
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private MemberEntity memberEntity;

    //N:1 커뮤니티
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private CommunityEntity communityEntity;

    //N:1 상품
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product productEntity;

}
