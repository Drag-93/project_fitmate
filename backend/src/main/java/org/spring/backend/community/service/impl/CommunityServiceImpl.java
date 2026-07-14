package org.spring.backend.community.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.spring.backend.common.TableType;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.repository.CategoryRepository;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.community.service.CommunityService;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceImpl implements CommunityService{
  
private final CommunityRepository communityRepository;
private final CategoryRepository categoryRepository;
private final MemberRepository memberRepository;
private final FileHandler fileHandler;

    @Value("${img.path.community}")
    private String path;

  public void saveFile(MultipartFile file, String filePath) throws IOException{
    File destinationFile = new File(filePath.replace("file://",""));
    file.transferTo(destinationFile);
  }
      //고유 파일 이름 생성
    private String generateUniqueFileName(String originalFileName) {
        UUID uuid = UUID.randomUUID();
        return uuid + "-" + originalFileName;
    }
@Transactional
public void insertWithFile(CommunityDto communityDto, String  userEmail) {
      //회원조회
      MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
              .orElseThrow(()->new NoSuchElementException("회원이 존재하지 않습니다"));

      Long categoryId = communityDto.getCategoryId();
        //카테고리 조회
      CategoryEntity category = categoryRepository.findById(categoryId)
              .orElseThrow(()->new IllegalArgumentException("존재하지 않는 카테고리입니다"));
    // 1. 엔티티 우선 저장 (게시글 정보)
    CommunityEntity communityEntity = CommunityEntity.builder()
            .memberEntity(memberEntity)
        .title(communityDto.getTitle())
        .userName(communityDto.getUserName())
        .content(communityDto.getContent())
        .categoryEntity(category)
            .categoryName(category.getCategoryName())
            .tabId(category.getTabEntity().getId())
            .tabName(category.getTabEntity().getTabName())
            .userEmail(memberEntity.getUserEmail())
        .hasFile(1)
        .hit(0)
        .reply(0)
        .build();
    CommunityEntity saveCommunity = communityRepository.save(communityEntity);

    // 2. 파일 저장 (위에서 저장된 게시글의 ID를 사용)
    try {
        String originalFilename = communityDto.getAttachFile().getOriginalFilename();
        String newFileName = generateUniqueFileName(originalFilename);
        String filePath = path + "/" + newFileName;

        File fileDir = new File(path);
        if (!fileDir.exists()) fileDir.mkdirs();

        communityDto.getAttachFile().transferTo(new File(filePath));


        // 3. 파일 엔티티 저장
       fileHandler.insertFile(filePath, TableType.COMMUNITY, saveCommunity.getId(), communityDto.getAttachFile());
    } catch (IOException e) {
        // 파일 저장 실패 시 예외 처리 (트랜잭션에 의해 게시글도 롤백됨)
        throw new RuntimeException("파일 저장 중 오류 발생", e);
    }
}
    @Transactional
    public void insertWithOutFile(CommunityDto communityDto, String  userEmail) {
        //회원조회
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(()->new NoSuchElementException("회원이 존재하지 않습니다"));
        // 1. 카테고리 조회 (존재 여부 확인 및 객체 획득)
        Long categoryId = communityDto.getCategoryId();
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다"));
        // 2. 조회한 category 객체를 Builder에 연결
        CommunityEntity communityEntity = CommunityEntity.builder()
                .memberEntity(memberEntity)
                .tabName(category.getTabEntity().getTabName())
                .tabId(category.getTabEntity().getId())
                .title(communityDto.getTitle())
                .userName(communityDto.getUserName())
                .content(communityDto.getContent())
                .categoryEntity(category) // ★ 이 부분을 넣어줘야 귀속됩니다!
                .categoryName(category.getCategoryName())
                .hasFile(0)
                .hit(0)
                .reply(0)
                .userEmail(memberEntity.getUserEmail())
                .build();

        communityRepository.save(communityEntity);
    }

    @Override
    public void communityInsert(CommunityDto communityDto, String userEmail) {
      if (communityDto.getAttachFile() == null || communityDto.getAttachFile().isEmpty()){
          insertWithOutFile(communityDto, userEmail);
      }else{
          insertWithFile(communityDto, userEmail);
      }
    }

    @Override
  public List<CommunityDto> communityList() {
    return communityRepository.findAll().stream().map(el->
      CommunityDto.builder()
      .id(el.getId())
      .title(el.getTitle())
      .content(el.getContent())
      .hasFile(el.getHasFile())
              .userName(el.getUserName())
      .hit(el.getHit())
      .createTime(el.getCreateTime())
      .updateTime(el.getUpdateTime())
      .categoryId(el.getCategoryEntity().getId())
      .build()
    ).collect(Collectors.toList());
  }

  @Override
  @Transactional
public void communityUpdate(Long id, CommunityDto communityDto, String userEmail ) {
      MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
              .orElseThrow(()->new NoSuchElementException("회원이 존재하지 않습니다"));
    // 게시글 찾기
    CommunityEntity entity = communityRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("게시글을 찾을 수 없습니다: " + id));

    // 엔티티 업데이트 로직 수행
    entity.setTitle(communityDto.getTitle());
    entity.setContent(communityDto.getContent());
    entity.setHasFile(communityDto.getHasFile());

    CategoryEntity categoryEntity = categoryRepository.findById(communityDto.getCategoryId())
                    .orElseThrow(()-> new NoSuchElementException("존재하지 않는 카테고리입니다."));
    entity.setCategoryEntity(categoryEntity);
    entity.setCategoryName(categoryEntity.getCategoryName());
    entity.setTabId(communityDto.getTabId());
    entity.setTabName(communityDto.getTabName());
    entity.setUserName(memberEntity.getUserName());
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
  @Transactional
  public CommunityDto communityDetail(Long id, String userEmail) {
   CommunityEntity communityEntity = communityRepository.findById(id)
   .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다"));

   return CommunityDto.builder()
   .id(communityEntity.getId())
           .userName(communityEntity.getUserName())
   .title(communityEntity.getTitle())
   .content(communityEntity.getContent())
   .categoryId(communityEntity.getCategoryEntity().getId())
           .categoryName(communityEntity.getCategoryEntity().getCategoryName())
   .hasFile(communityEntity.getHasFile())
           .tabId(communityEntity.getCategoryEntity().getTabEntity().getId())
           .tabName(communityEntity.getCategoryEntity().getTabEntity().getTabName())
   .hit(communityEntity.getHit())
   .reply(communityEntity.getReply())
   .createTime(communityEntity.getCreateTime())
   .updateTime(communityEntity.getUpdateTime())
   .build();
  }
    @Transactional
    @Override
    public void updateHit(Long id) {
        CommunityEntity entity = communityRepository.findById(id).orElseThrow();
        entity.setHit(entity.getHit() + 1);
    }

    @Override
    @Transactional
    public List<CommunityDto> findCommunityList(Long tabId, Long categoryId) {
        List<CommunityEntity> entities;

        // 1. 카테고리 ID가 있으면 카테고리 우선 조회
        if (categoryId != null) {
            entities = communityRepository.findByCategoryEntity_Id(categoryId);
        }
        // 2. 탭 ID만 있으면 탭으로 조회
        else if (tabId != null) {
            entities = communityRepository.findByTabId(tabId);
        }
        // 3. 둘 다 없으면 전체 조회
        else {
            entities = communityRepository.findAll();
        }

        // 4. DTO 변환 (중복 로직 제거)
        return entities.stream().map(el -> CommunityDto.builder()
                .id(el.getId())
                .userName(el.getUserName())
                .title(el.getTitle())
                .content(el.getContent())
                .categoryId(el.getCategoryEntity().getId())
                .categoryName(el.getCategoryEntity().getCategoryName())
                .tabId(el.getCategoryEntity().getTabEntity().getId()) // 탭 이름 추가
                .createTime(el.getCreateTime())
                .hit(el.getHit())
                .build()
        ).collect(Collectors.toList());
    }
}
