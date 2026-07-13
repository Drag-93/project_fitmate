package org.spring.backend.file.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.spring.backend.common.TableType;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.member.entity.MemberEntity;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileDto {
    private Long id;

    private TableType tableType;

    private String newFileName;

    private String oldFileName;

    private Long memberId;

    private Long communityId;

    private Long productId;

    private String category;

    private MemberEntity memberEntity;

    private CommunityEntity communityEntity;

//    private ProductEntity productEntity;
    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
