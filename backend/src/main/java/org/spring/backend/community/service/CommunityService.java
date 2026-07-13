package org.spring.backend.community.service;

import org.spring.backend.community.dto.CommunityDto;

import java.util.List;

public interface CommunityService {
  void communityInsert(CommunityDto communityDto, String userEmail);

  List<CommunityDto> communityList();

  void communityUpdate(Long id, CommunityDto communityDto, String  userEmail);

  void communityDelete(Long id);

  CommunityDto communityDetail(Long id, String userEmail);

  void updateHit(Long id);

  List<CommunityDto> findCommunityList(Long tabId, Long categoryId);
}
