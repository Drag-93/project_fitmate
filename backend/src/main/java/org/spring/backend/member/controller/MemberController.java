package org.spring.backend.member.controller;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.dto.MemberDto;
import org.spring.backend.member.jwt.CustomUserDetails;
import org.spring.backend.member.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/join")
    public ResponseEntity<?> join(MemberDto memberDto){
        // 회원가입 비즈니스 로직 실행
        memberService.insertMember(memberDto);

        return ResponseEntity.ok("ok");
    }

    //초기 authSlice에 멤버데이터를 넣기 위한 api
    @GetMapping("/init/{userEmail:.+}") //이메일 특성상 test@email.com으로 들어오기에 .뒤까지 읽을수 있게 설정
    public ResponseEntity<?> memberinit(@PathVariable("userEmail")String userEmail){
        MemberDto memberDto = memberService.memberInit(userEmail);

        Map<String, MemberDto> map = new HashMap<>();
        map.put("result", memberDto);
        //상태 (state), 값(body)
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //마이페이지 로딩시 회원정보 전달 api
    @GetMapping("/detail")
    public ResponseEntity<?> memberDetail(@AuthenticationPrincipal CustomUserDetails userDetails){
        String userEmail = userDetails.getUsername();

        MemberDto memberDto = memberService.memberInit(userEmail);

        Map<String, MemberDto> map = new HashMap<>();
        map.put("result", memberDto);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    //회원탈퇴 api
    @DeleteMapping("/quit")
    public ResponseEntity<?> myPageDelete(@AuthenticationPrincipal CustomUserDetails userDetails){
        String userEmail = userDetails.getUsername();
        memberService.memberDelete(userEmail);
        return ResponseEntity.ok("ok");
    }

    //회원수정 api
    @PutMapping("/update")
    public ResponseEntity<?> myPageUpdate(@ModelAttribute MemberDto memberDto) throws IOException {
        memberService.memberUpdate(memberDto);
        return ResponseEntity.ok("ok");
    }
}
