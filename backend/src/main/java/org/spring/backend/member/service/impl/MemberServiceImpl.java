package org.spring.backend.member.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.dto.MemberDto;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.member.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    @Transactional
    @Override
    public void insertMember(MemberDto memberDto) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findByUserEmail(memberDto.getUserEmail());
        if(optionalMemberEntity.isPresent()){
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        memberRepository.save(MemberEntity.toInsertMemberEntity(memberDto,passwordEncoder.encode(memberDto.getUserPw())));
    }
    @Override
    public boolean emailCheck(String userEmail) {
        return memberRepository.existsByUserEmail(userEmail);
    }

    @Override
    public List<MemberDto> memberList() {
        return memberRepository.findAll().stream().map(MemberDto::toMemberDto)
                .collect(Collectors.toList());
    }
    @Override
    public Page<MemberDto> memberList(Pageable pageable, String subject, String search) {
        if(subject==null||subject.isBlank()||search==null||search.isBlank()){
            return memberRepository.findAll(pageable).map(MemberDto::toMemberDto);
        }
        Page<MemberEntity> memberEntities = null;
        //멤버리스트 검색필터링기능
        switch (subject){
            case "userName":
                memberEntities = memberRepository.findByUserNameContaining(pageable, search);
                break;
            case "userEmail":
                memberEntities = memberRepository.findByUserEmailContaining(pageable, search);
                break;
            default:
                memberEntities = memberRepository.findAll(pageable);
        }
        return memberEntities.map(MemberDto::toMemberDto);
    }
    @Override
    public MemberDto memberDetail(Long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        return MemberDto.toMemberDto(memberEntity);
    }

    @Transactional
    @Override
    public void memberUpdate(MemberDto memberDto) {
        MemberEntity memberEntity = memberRepository.findById(memberDto.getId())
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        if(!memberDto.getUserEmail().equals(memberEntity.getUserEmail())){
            if(memberRepository.existsByUserEmail(memberDto.getUserEmail())){
                throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
            }
        }
        memberRepository.save(MemberEntity.toUpdateMemberEntity(memberDto, passwordEncoder.encode(memberDto.getUserPw())));
    }
    @Transactional
    @Override
    public void memberDelete(Long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        memberRepository.deleteById(id);
    }
}
