package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CommunityReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityReplyRepository extends JpaRepository<CommunityReplyEntity, Long> {
    List<CommunityReplyEntity> findByCommunityEntity_id(Long communityId);
}
