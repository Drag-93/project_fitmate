package org.spring.backend.community.service;

import org.spring.backend.community.dto.CommunityReplyDto;

import java.util.List;

public interface CommunityReplyService {
    public void insertReply(CommunityReplyDto dto);

    public List<CommunityReplyDto> replyList(Long communityId);

    public void deleteReply(Long id);

    public void updateReply(Long id, CommunityReplyDto dto);

    public CommunityReplyDto detailReply(Long id);
}
