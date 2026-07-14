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
import org.springframework.security.core.context.SecurityContextHolder;
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
        // 1. SecurityContext에서 현재 인증된 유저의 정보를 가져옵니다.
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. 해당 username을 기반으로 DB에서 Member를 찾습니다.
        // (만약 findByUsername이 없다면 memberRepository에 추가해주세요)
        MemberEntity memberEntity = memberRepository.findByUserEmail(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("로그인한 회원을 찾을 수 없습니다."));

        // 3. 게시글 정보 조회 (dto에 들어있는 communityId 사용)
        Long communityId = Long.parseLong(String.valueOf(dto.getCommunityId()));
        CommunityEntity communityEntity = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        // 4. 엔티티 생성 시 조회한 memberEntity를 직접 사용
        CommunityReplyEntity replyEntity = CommunityReplyEntity.builder()
                .content(dto.getContent())
                .userName(memberEntity.getUserName()) // 로그인한 유저의 이름을 사용
                .communityEntity(communityEntity)
                .memberEntity(memberEntity) // null이 아닌 실제 엔티티 객체 전달
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
