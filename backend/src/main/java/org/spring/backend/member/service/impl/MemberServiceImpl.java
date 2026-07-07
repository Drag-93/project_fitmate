package org.spring.backend.member.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.spring.backend.member.dto.MemberDto;
import org.spring.backend.member.entity.MemberAddEntity;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.entity.MemberFileEntity;
import org.spring.backend.member.repository.MemberAddRepository;
import org.spring.backend.member.repository.MemberFileRepository;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.member.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MemberAddRepository memberAddRepository;
    private final MemberFileRepository memberFileRepository;

    @Value("${img.path.member}")
    private String filePath;
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
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        return MemberDto.toMemberDto(memberEntity);
    }

    @Transactional
    @Override
    public void memberUpdate(MemberDto memberDto) throws IOException {
        MemberEntity originMemberEntity = memberRepository.findById(memberDto.getId())
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        if(!memberDto.getUserEmail().equals(originMemberEntity.getUserEmail())) {
            if (memberRepository.existsByUserEmail(memberDto.getUserEmail())) {
                throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
            }
        }
        originMemberEntity.setUserEmail(memberDto.getUserEmail());
        if(memberDto.getUserPw() !=null && !memberDto.getUserPw().trim().isEmpty()){
            originMemberEntity.setUserPw(passwordEncoder.encode(memberDto.getUserPw()));
        }
        originMemberEntity.setUserName(memberDto.getUserName());
        originMemberEntity.setUserAddress(memberDto.getUserAddress());
        originMemberEntity.setUserPhone(memberDto.getUserPhone());

        if(memberDto.getMemberFile() == null){
            originMemberEntity.setProfilePhoto(memberDto.getProfilePhoto());
            memberRepository.save(originMemberEntity);
            return;
        }
        try{

            //기존에 파일있을땐 새파일로 교체, 이전파일은 제거
            Optional<MemberFileEntity> optionalMemberFileEntity = memberFileRepository.findByMemberEntityId(memberDto.getId());
            if(optionalMemberFileEntity.isPresent()){
                // file:///E:/fitmate/backend/member/와 파일명을 조합하여 URI 생성
    //            URI fileUri = new URI(filePath + optionalMemberFileEntity.get().getNewFileName());
                //테스트시에는 경로uri사용할수 없기에 로컬로 사용
    //            File deleteFile = new File(fileUri);
                originMemberEntity.setMemberFileEntity(null);
                memberFileRepository.delete(optionalMemberFileEntity.get());
                //변경사항 즉시반영
                memberFileRepository.flush();

                String localPath = filePath.replace("file://", "");
                Path targetFilePath = Paths.get(localPath).resolve(optionalMemberFileEntity.get().getNewFileName());
                File deleteFile = targetFilePath.toFile();
                if(deleteFile.exists()) deleteFile.delete();
            }
        //새로운 파일 저장
        MultipartFile memberFile = memberDto.getMemberFile();
        String oldFileName = memberFile.getOriginalFilename();
        String newFileName = UUID.randomUUID() + "_" + oldFileName;
        // file:///E:/fitmate/backend/member/와 파일명을 조합하여 URI 생성
//        URI fileUri = new URI(filePath + newFileName);
//        memberFile.transferTo(new File(fileUri));
//      테스트시에는 경로uri를 사용할수 없기에 로컬로 사용
        String localPath = filePath.replace("file://", "");
        Path targetPath = Paths.get(localPath).resolve(newFileName);
        //만약 폴더가 없을때 생성
        if (!Files.exists(targetPath.getParent())) {
            Files.createDirectories(targetPath.getParent());
        }
        memberFile.transferTo(new File(localPath + newFileName));
        //멤버 및 멤버 정보 저장
        originMemberEntity.setProfilePhoto(1);
        MemberEntity saveMember = memberRepository.save(originMemberEntity);
        MemberFileEntity memberFileEntity = MemberFileEntity.builder()
                .oldFileName(oldFileName)
                .newFileName(newFileName)
                .memberEntity(saveMember)
                .build();
        memberFileRepository.save(memberFileEntity);
        }catch (Exception e){
            System.out.println("파일 저장 중 에러 발생: " + e.getMessage());
            e.printStackTrace();

            throw new RuntimeException("회원 정보 수정 중 파일 처리 실패", e);
        }
    }
    @Transactional
    @Override
    public void memberDelete(Long id) {
        MemberEntity memberEntity = memberRepository.findById(id)
                .orElseThrow(()->new NoSuchElementException("회원아이디 없음"));
        Optional<MemberFileEntity> optionalMemberFile = memberFileRepository.findByMemberEntityId(id);
        if(optionalMemberFile.isPresent()){
            MemberFileEntity fileEntity = optionalMemberFile.get();
            try{
                String localPath = filePath.replace("file://", "");
                Path targetFilePath = Paths.get(localPath).resolve(optionalMemberFile.get().getNewFileName());
                File deleteFile = targetFilePath.toFile();
                if(deleteFile.exists()) deleteFile.delete();
            }catch (Exception e){
                System.out.println("회원탈퇴 파일 삭제 중 에러 : "+e.getMessage());
            }
        }
        memberRepository.deleteById(id);
    }

    @Override
    public void memberDelete(String userEmail) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(()->new NoSuchElementException("회원정보 없음"));
        Optional<MemberFileEntity> optionalMemberFile = memberFileRepository.findByMemberEntityId(memberEntity.getId());
        if(optionalMemberFile.isPresent()){
            MemberFileEntity fileEntity = optionalMemberFile.get();
            try{
                String localPath = filePath.replace("file://", "");
                Path targetFilePath = Paths.get(localPath).resolve(optionalMemberFile.get().getNewFileName());
                File deleteFile = targetFilePath.toFile();
                if(deleteFile.exists()) deleteFile.delete();
            }catch (Exception e){
                System.out.println("회원탈퇴 파일 삭제 중 에러 : "+e.getMessage());
            }
        }
        memberRepository.deleteById(memberEntity.getId());
    }

    @Override
    public MemberDto memberInit(String userEmail) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
        .orElseThrow(()->new NoSuchElementException("이메일이 존재하지 않습니다."));

        return MemberDto.toMemberDto(memberEntity);
    }
}
