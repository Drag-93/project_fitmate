package org.spring.backend.community.service;

import org.spring.backend.community.dto.CommunityDto;

import java.util.List;

public interface CommunityService {
  void communityInsert(CommunityDto communityDto);

  List<CommunityDto> communityList();

  void communityUpdate(Long id, CommunityDto communityDto);

  void communityDelete(Long id);

  CommunityDto communityDetail(Long id);

  List<CommunityDto> findByTab(Long tabId);

  List<CommunityDto> findByCategory(Long categoryId);
}
