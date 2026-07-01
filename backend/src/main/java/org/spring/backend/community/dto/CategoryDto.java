package org.spring.backend.community.dto;

import org.spring.backend.community.entity.TabEntity;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
  private Long id;

  private String categoryName;

  private TabEntity tabEntity;
}
