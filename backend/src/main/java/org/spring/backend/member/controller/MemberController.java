package org.spring.backend.member.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.dto.MemberDto;
import org.spring.backend.member.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/join")
    public ResponseEntity<?> join(MemberDto memberDto){
        System.out.println(memberDto.getUserPw());
        // 회원가입 비즈니스 로직 실행
        memberService.insertMember(memberDto);

        // 201 Created 상태코드와 함께 성공 메시지 반환
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }

}
