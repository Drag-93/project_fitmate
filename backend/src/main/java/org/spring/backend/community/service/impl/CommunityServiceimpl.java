package org.spring.backend.community.service.impl;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.FileEntity;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.community.repository.FileRepository;
import org.spring.backend.community.service.CommunityService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceimpl implements CommunityService{
private final CommunityRepository communityRepository;
private final FileRepository fileRepository;

  String path = "file:///E:/backend/community/";

  public void saveFile(MultipartFile file, String filePath) throws IOException{
    File destinationFile = new File(filePath.replace("file://",""));
    file.transferTo(destinationFile);
  }
      //고유 파일 이름 생성
    private String generateUniqueFileName(String originalFileName) {
        UUID uuid = UUID.randomUUID();
        return uuid + "-" + originalFileName;
    }

  @Override
@Transactional // DB 트랜잭션 보장
public void insertWithFile(CommunityDto communityDto) {
    // 1. 엔티티 우선 저장 (게시글 정보)
    CommunityEntity communityEntity = CommunityEntity.builder()
        .title(communityDto.getTitle())
        .content(communityDto.getContent())
        .hasFile(1)
        .hit(0)
        .build();
    CommunityEntity saveCommunity = communityRepository.save(communityEntity);

    // 2. 파일 저장 (위에서 저장된 게시글의 ID를 사용)
    try {
        String originalFilename = communityDto.getAttachFile().getOriginalFilename();
        String newFileName = generateUniqueFileName(originalFilename);
        String filePath = path + "/" + newFileName;

        File fileDir = new File(path);
        if (!fileDir.exists()) fileDir.mkdirs();
        
        saveFile(communityDto.getAttachFile(), filePath);

        // 3. 파일 엔티티 저장
        fileRepository.save(FileEntity.builder()
            .newFileName(newFileName)
            .oldFileName(originalFilename)
            .communityEntity(saveCommunity)
            .build());
    } catch (IOException e) {
        // 파일 저장 실패 시 예외 처리 (트랜잭션에 의해 게시글도 롤백됨)
        throw new RuntimeException("파일 저장 중 오류 발생", e);
    }
}

  
  @Override
  public void insertWithOutFile(CommunityDto communityDto) {
    CommunityEntity communityEntity = CommunityEntity.builder()
    .title(communityDto.getTitle())
    .content(communityDto.getContent())
    .hasFile(0)
    .hit(0)
    .build();
    communityRepository.save(communityEntity);
   }

  @Override
  public List<CommunityDto> communityList() {
    return communityRepository.findAll().stream().map(el->
      CommunityDto.builder()
      .id(el.getId())
      .title(el.getTitle())
      .content(el.getContent())
      .hasFile(el.getHasFile())
      .createTime(el.getCreateTime())
      .updateTime(el.getUpdateTime())
      .build()
    ).collect(Collectors.toList());
  }

  @Override
  public void communityUpdate(CommunityDto communityDto) {
   communityRepository.findById(communityDto.getId()).orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다"));
   communityRepository.save(CommunityEntity.builder()
   .id(communityDto.getId())
   .title(communityDto.getTitle())
   .content(communityDto.getContent())
   .hasFile(communityDto.getHasFile())
   .hit(communityDto.getHit())
   .build());

   
  }

  @Override
  public void communityDelete(Long id) {
    Optional<CommunityEntity> optionalCommunityEntity = communityRepository.findById(id);
    if (optionalCommunityEntity.isEmpty()) {
      throw new IllegalArgumentException("게시글이 존재하지 않습니다");
    }
      communityRepository.deleteById(id);
  }

  @Override
  public CommunityDto communityDetail(Long id) {
   CommunityEntity communityEntity = communityRepository.findById(id)
   .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다"));
   return CommunityDto.builder()
   .id(communityEntity.getId())
   .title(communityEntity.getTitle())
   .content(communityEntity.getContent())
   .hasFile(communityEntity.getHasFile())
   .hit(communityEntity.getHit())
   .reply(communityEntity.getReply())
   .createTime(communityEntity.getCreateTime())
   .updateTime(communityEntity.getUpdateTime())
   .build();
  }
}
