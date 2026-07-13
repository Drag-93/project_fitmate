package org.spring.backend.community.repository;

import org.spring.backend.community.entity.CommunityReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityReplyRepository extends JpaRepository<CommunityReplyEntity, Long> {

    @Query("SELECT r FROM CommunityReplyEntity r LEFT JOIN FETCH r.memberEntity WHERE r.communityEntity.id = :communityId")
    List<CommunityReplyEntity> findAllByCommunityId(@Param("communityId") Long communityId);
}
