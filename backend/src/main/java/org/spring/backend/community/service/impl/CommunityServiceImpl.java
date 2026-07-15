package org.spring.backend.community.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import org.spring.backend.common.Role;
import org.spring.backend.common.TableType;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.TabEntity;
import org.spring.backend.community.repository.CategoryRepository;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.community.service.CommunityService;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

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

    private void checkTabWritePermission(TabEntity tab, String requesterEmail) {
        if (!Boolean.TRUE.equals(tab.getAdminOnly())) {
            return; // 일반 탭이면 통과
        }

        MemberEntity requester = memberRepository.findByUserEmail(requesterEmail)
                .orElseThrow(() -> new NoSuchElementException("회원이 존재하지 않습니다"));

        // ★ Role은 enum이므로 String과 비교하면 안 됨. enum끼리 비교해야 함.
        if (requester.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "공지사항은 관리자만 작성/수정/삭제할 수 있습니다."
            );
        }
    }
      //고유 파일 이름 생성
    private String generateUniqueFileName(String originalFileName) {
        UUID uuid = UUID.randomUUID();
        return uuid + "-" + originalFileName;
    }

    @Override
    public void communityInsert(CommunityDto communityDto, String userEmail) {
      MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
              .orElseThrow(()->new NoSuchElementException("회원이 존재하지 않습니다"));

      CategoryEntity categoryEntity = categoryRepository.findById(communityDto.getCategoryId())
              .orElseThrow(()->new NoSuchElementException("존재하지 않는 카테고리입니다."));

      checkTabWritePermission(categoryEntity.getTabEntity(), userEmail);

      boolean hasFile = communityDto.getAttachFile() != null && !communityDto.getAttachFile().isEmpty();

      CommunityEntity communityEntity = CommunityEntity.builder()
              .memberEntity(memberEntity)
              .title(communityDto.getTitle())
              .userName(communityDto.getUserName())
              .content(communityDto.getContent())
              .categoryEntity(categoryEntity)
              .categoryName(categoryEntity.getCategoryName())
              .tabId(categoryEntity.getTabEntity().getId())
              .tabName(categoryEntity.getTabEntity().getTabName())
              .userEmail(communityDto.getUserEmail())
              .hasFile(hasFile?1:0)
              .hit(0)
              .reply(0)
              .build();

      CommunityEntity saveCommunity = communityRepository.save(communityEntity);
      if (hasFile){
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
    }

    @Override
  public Page<CommunityDto> communityList(Pageable pageable, String subject, String search) {
      if (subject==null||subject.isBlank()||search==null||search.isBlank()){
          return communityRepository.findAll(pageable).map(CommunityDto::toCommunityDto);
      }
    Page<CommunityEntity> communityEntities = null;
      switch (subject){
          case "title":
              communityEntities = communityRepository.findByTitleContaining(pageable, search);
                      break;
          case "content":
              communityEntities=communityRepository.findByContentContaining(pageable, search);
                      break;
          case "userName":
              communityEntities=communityRepository.findByUserNameContaining(pageable, search);
                      break;
          default:
              communityEntities= communityRepository.findAll(pageable);
      }
      return communityEntities.map(CommunityDto::toCommunityDto);
  }

    @Override
    @Transactional
    public void communityUpdate(Long id, CommunityDto communityDto, String userEmail) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("회원이 존재하지 않습니다"));

        CommunityEntity entity = communityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글을 찾을 수 없습니다: " + id));

        checkManage(entity.getUserEmail(), userEmail);
        checkTabWritePermission(entity.getCategoryEntity().getTabEntity(), userEmail);

        entity.setTitle(communityDto.getTitle());
        entity.setContent(communityDto.getContent());
        entity.setHasFile(communityDto.getHasFile());

        CategoryEntity categoryEntity = categoryRepository.findById(communityDto.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 카테고리입니다."));
        entity.setCategoryEntity(categoryEntity);
        entity.setCategoryName(categoryEntity.getCategoryName());
        entity.setTabId(communityDto.getTabId());
        entity.setTabName(communityDto.getTabName());
        entity.setUserName(memberEntity.getUserName());
    }

    @Override
    @Transactional
    public void communityDelete(Long id, String userEmail) {
        CommunityEntity entity = communityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("게시글이 존재하지 않습니다"));

        checkManage(entity.getUserEmail(), userEmail);

        checkTabWritePermission(entity.getCategoryEntity().getTabEntity(), userEmail);

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
           .userEmail(communityEntity.getUserEmail())
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
    public Page<CommunityDto> findCommunityList(Long tabId, Long categoryId, Pageable pageable) {
        Page<CommunityEntity> entities;

        // 카테고리 ID가 있으면 카테고리 우선 조회
        if (categoryId != null) {
            entities = communityRepository.findByCategoryEntity_Id(categoryId, pageable);
        }
        // 탭 ID만 있으면 탭 조회
        else if (tabId != null) {
            entities = communityRepository.findByTabId(tabId, pageable);
        }
        else {
            entities = communityRepository.findAll(pageable);
        }

        return entities.map(el -> CommunityDto.builder()
                .id(el.getId())
                .userName(el.getUserName())
                .title(el.getTitle())
                .content(el.getContent())
                .categoryId(el.getCategoryEntity().getId())
                .categoryName(el.getCategoryEntity().getCategoryName())
                .tabId(el.getCategoryEntity().getTabEntity().getId())
                .createTime(el.getCreateTime())
                .hit(el.getHit())
                .build()
        );
    }

    //작성자 또는 관리자 검증
    private void checkManage(String ownerEmail, String requesterEmail) {
        MemberEntity requester = memberRepository.findByUserEmail(requesterEmail)
                .orElseThrow(() -> new NoSuchElementException("회원이 존재하지 않습니다"));

        boolean isOwner = ownerEmail.equals(requesterEmail);

        boolean isAdmin = requester.getRole() == Role.ADMIN;

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("본인 또는 관리자만 수정/삭제할 수 있습니다");
        }
    }
}
