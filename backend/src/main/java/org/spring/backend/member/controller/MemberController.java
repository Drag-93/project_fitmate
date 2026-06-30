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
    public ResponseEntity<?> join(@Valid @RequestBody MemberDto memberDto,
                                  BindingResult bindingResult){
        // 유효성 검사 실패 시
        if (bindingResult.hasErrors()) {
            // 에러 메시지들을 맵이나 리스트로 모아서 반환
            Map<String, String> errorMap = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errorMap.put(error.getField(), error.getDefaultMessage())
            );

            // 400 Bad Request 상태코드와 함께 에러 데이터 반환
            return ResponseEntity.badRequest().body(errorMap);
        }

        // 회원가입 비즈니스 로직 실행
        memberService.insertMember(memberDto);

        // 201 Created 상태코드와 함께 성공 메시지 반환
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }

}
