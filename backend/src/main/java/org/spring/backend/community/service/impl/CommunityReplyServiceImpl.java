package org.spring.backend.community.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.community.dto.CommunityReplyDto;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.CommunityReplyEntity;
import org.spring.backend.community.repository.CommunityReplyRepository;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.community.service.CommunityReplyService;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CommunityReplyServiceImpl implements CommunityReplyService {
    private final CommunityRepository communityRepository;
    private final CommunityReplyRepository communityReplyRepository;
    private final MemberRepository memberRepository;

@Override
public void insertReply(CommunityReplyDto dto) {
    //회원 조회
     MemberEntity memberEntity = memberRepository.findById(dto.getMemberId())
             .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다"));

            //게시글 조회
    CommunityEntity communityEntity = communityRepository.findById(dto.getCommunityId())
            .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다"));

    CommunityReplyEntity replyEntity = CommunityReplyEntity.builder()
            .content(dto.getContent())
            .userName(dto.getUserName())
            .communityEntity(communityEntity)
             .memberEntity(memberEntity)
            .build();

    communityReplyRepository.save(replyEntity);
}

    @Override
    public List<CommunityReplyDto> replyList(Long communityId) {
        return communityReplyRepository.findAllByCommunityId(communityId)
                .stream().map(CommunityReplyDto::toReplyDto).toList();
    }

    @Override
    public void deleteReply(Long id) {
        if (!communityReplyRepository.existsById(id)){
            throw new IllegalArgumentException("댓글이 존재하지 않습니다");
        }
        communityReplyRepository.deleteById(id);
    }

    @Override
    public void updateReply(Long id, CommunityReplyDto dto) {
        CommunityReplyEntity replyEntity = communityReplyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다"));

        replyEntity.setContent(dto.getContent());
        communityReplyRepository.save(replyEntity);
    }

    @Override
    public CommunityReplyDto detailReply(Long id) {
        CommunityReplyEntity replyEntity = communityReplyRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("댓글이 없습니다"));
        return CommunityReplyDto.toReplyDto(replyEntity);
    }
}
