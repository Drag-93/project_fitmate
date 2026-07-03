package org.spring.backend.member.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.dto.MemberDto;
import org.spring.backend.member.entity.MemberAddEntity;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberAddRepository;
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
    private final MemberAddRepository memberAddRepository;

    @Transactional
    @Override
    public void insertMember(MemberDto memberDto) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findByUserEmail(memberDto.getUserEmail());
        if(optionalMemberEntity.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        //저장과 동시에 저장용 데이터 생성
        MemberEntity memberEntity = MemberEntity.toInsertMemberEntity(memberDto,passwordEncoder.encode(memberDto.getUserPw()));
        //추가 멤버데이터 저장을 위해 더미데이터 생성
        MemberAddEntity memberAdd = MemberAddEntity.createDefault();
        //두 엔티티 간의 양방향 연관관계(1:1) 연결
        memberAdd.setMemberEntity(memberEntity);
        memberEntity.setMemberAddEntity(memberAdd);
        //추가 멤버데이터까지 새로 저장
        memberRepository.save(memberEntity);
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

    @Override
    public MemberDto memberDetail(String userEmail) {
        return null;
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

    @Override
    public void memberDelete(String userEmail) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(()->new NoSuchElementException("회원정보 없음"));
        memberRepository.deleteById(memberEntity.getId());
    }

    @Override
    public MemberDto memberInit(String userEmail) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
        .orElseThrow(()->new NoSuchElementException("이메일이 존재하지 않습니다."));

        return MemberDto.toMemberDto(memberEntity);
    }
}
