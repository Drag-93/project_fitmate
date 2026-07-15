package org.spring.backend.community.service;

import org.spring.backend.community.dto.CommunityDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommunityService {
  void communityInsert(CommunityDto communityDto, String userEmail);

  Page<CommunityDto> communityList(Pageable pageable, String subject, String search);

  void communityUpdate(Long id, CommunityDto communityDto, String  userEmail);

  void communityDelete(Long id, String userEmail);

  CommunityDto communityDetail(Long id, String userEmail);

  void updateHit(Long id);

  Page<CommunityDto> findCommunityList(Long tabId, Long categoryId, Pageable pageable);
}
