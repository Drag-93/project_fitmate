package org.spring.backend.community.service;

import org.spring.backend.community.dto.TabDto;

import java.util.List;

public interface TabService {
  void insertTab(TabDto tabDto);

  List<TabDto> tabList();

  void tabUpdate(TabDto tabDto);

  void tabDelete(Long id);

  TabDto tabDetail(Long id);
}
