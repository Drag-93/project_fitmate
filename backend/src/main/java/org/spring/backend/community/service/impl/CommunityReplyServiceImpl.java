package org.spring.backend.community.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.member.enumtype.Role;
import org.spring.backend.community.dto.CommunityReplyDto;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.CommunityReplyEntity;
import org.spring.backend.community.repository.CommunityReplyRepository;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.community.service.CommunityReplyService;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommunityReplyServiceImpl implements CommunityReplyService {
    private final CommunityRepository communityRepository;
    private final CommunityReplyRepository communityReplyRepository;
    private final MemberRepository memberRepository;

    private void checkReplyWritePermission(CommunityEntity communityEntity, String requesterEmail){
        CategoryEntity categoryEntity = communityEntity.getCategoryEntity();

        // 카테고리네임이 QNA인 경우만 제한
        if (!"QNA".equals(categoryEntity.getCategoryName())){
            return;
        }
        MemberEntity requester = memberRepository.findByUserEmail(requesterEmail)
                .orElseThrow(()-> new NoSuchElementException("회원이 존재하지 않습니다"));
        if (requester.getRole()!= Role.ADMIN){
            throw new AccessDeniedException("QNA 게시글의 댓글은 관리자만 작성할 수 있습니다.");
        }
    }

    @Override
    public void insertReply(CommunityReplyDto dto) {
        // 1. SecurityContext에서 현재 인증된 유저의 정보를 가져옵니다.
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. 해당 username을 기반으로 DB에서 Member를 찾습니다.
        MemberEntity memberEntity = memberRepository.findByUserEmail(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("로그인한 회원을 찾을 수 없습니다."));


        // 3. 게시글 정보 조회 (dto에 들어있는 communityId 사용)
        Long communityId = Long.parseLong(String.valueOf(dto.getCommunityId()));
        CommunityEntity communityEntity = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        checkReplyWritePermission(communityEntity, memberEntity.getUserEmail());


        boolean isQna = communityEntity.getCategoryName() != null &&
                communityEntity.getCategoryName().toUpperCase().contains("QNA");
        boolean isAdmin = "ADMIN".equals(memberEntity.getRole().name()); // 회원의 권한 확인 방식에 맞게 수정

        if (isQna && !isAdmin) {
            throw new IllegalStateException("QNA 게시판에는 관리자만 댓글을 작성할 수 있습니다.");
        }

        // 4. 엔티티 생성 시 조회한 memberEntity를 직접 사용
        CommunityReplyEntity replyEntity = CommunityReplyEntity.builder()
                .content(dto.getContent())
                .userEmail(memberEntity.getUserEmail())
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
