package org.spring.backend.community.service;

import org.spring.backend.community.dto.CategoryDto;
import org.spring.backend.community.dto.TabDto;

import java.util.List;

public interface TabService {
  void insertTab(List<TabDto> tabDtoList);

  List<TabDto> tabList();

  void tabUpdate(TabDto tabDto);

  void tabDelete(Long id);

  TabDto tabDetail(Long id);

  List<CategoryDto> categoryList();
}
