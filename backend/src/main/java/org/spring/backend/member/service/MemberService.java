package org.spring.backend.member.service;

import org.spring.backend.member.dto.MemberDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MemberService {
    void insertMember(MemberDto memberDto);

    boolean emailCheck(String userEmail);

    List<MemberDto> memberList();

    Page<MemberDto> memberList(Pageable pageable, String subject, String search);

    MemberDto memberDetail(Long id);

    void memberUpdate(MemberDto memberDto);

    void memberDelete(Long id);
}
