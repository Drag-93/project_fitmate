package org.spring.backend.community.service;

import org.spring.backend.community.dto.CommunityDto;

import java.util.List;

public interface CommunityService {
  void insertWithFile(CommunityDto communityDto);
  void insertWithOutFile(CommunityDto communityDto);

  List<CommunityDto> communityList();

  void communityUpdate(CommunityDto communityDto);

  void communityDelete(Long id);

  CommunityDto communityDetail(Long id);
}
