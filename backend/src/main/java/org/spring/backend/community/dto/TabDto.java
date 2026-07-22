package org.spring.backend.community.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.spring.backend.community.entity.TabEntity;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TabDto {
  private Long id;

  private String tabName;

  private Boolean adminOnly;

  private List<CategoryDto> categoryList;

  private List<String> categoryNames;

  public static TabDto toTabDto(TabEntity entity) {
    return TabDto.builder()
            .id(entity.getId())
            .tabName(entity.getTabName())
            .adminOnly(entity.getAdminOnly())
            .build();
  }
}
