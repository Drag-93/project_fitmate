package org.spring.backend.community.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.spring.backend.community.dto.CategoryDto;
import org.spring.backend.community.dto.TabDto;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.TabEntity;
import org.spring.backend.community.repository.CategoryRepository;
import org.spring.backend.community.repository.TabRepository;
import org.spring.backend.community.service.TabService;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TabServiceImpl implements TabService {
    private final TabRepository tabRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void insertTab(TabDto tabDto) {
        TabEntity tab = TabEntity.builder()
                .tabName(tabDto.getTabName())
                .build();
        TabEntity saveTab = tabRepository.save(tab);

        for (CategoryDto catDto : tabDto.getCategoryDtos()) {
            CategoryEntity category = CategoryEntity.builder()
                    .categoryName(catDto.getCategoryName())
                    .tabEntity(saveTab)
                    .build();
            categoryRepository.save(category);
        }
    }

    @Override
    public List<TabDto> tabList() {
        List<TabEntity> tabEntities = tabRepository.findAll();

        return tabEntities.stream().map(el -> {
            List<CategoryDto> dtos = el.getCategoryList().stream()
                    .map(cat -> CategoryDto.builder()
                            .id(cat.getId())
                            .categoryName(cat.getCategoryName())
                            .build())
                    .collect(Collectors.toList());

            List<String> names = el.getCategoryList().stream()
                    .map(CategoryEntity::getCategoryName)
                    .collect(Collectors.toList());

            return TabDto.builder()
                    .id(el.getId())
                    .tabName(el.getTabName())
                    .categoryDtos(dtos)
                    .categoryNames(names)
                    .build();
        }).toList();
    }

    @Override
    @Transactional
    public void tabUpdate(TabDto tabDto) {
        // 1. 탭 조회
        TabEntity tab = tabRepository.findById(tabDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("탭이 존재하지 않습니다"));

        // 2. 탭 이름 수정
        tab.setTabName(tabDto.getTabName());

        // 3. 기존 카테고리 리스트 가져오기
        List<CategoryEntity> existingCategories = tab.getCategoryList();

        // 4. 요청받은 카테고리 DTO를 기반으로 리스트 동기화
        List<CategoryEntity> updatedCategories = tabDto.getCategoryDtos().stream()
                .map(dto -> {
                    if (dto.getId() != null) {
                        // 기존 카테고리 업데이트
                        CategoryEntity existing = existingCategories.stream()
                                .filter(c -> c.getId().equals(dto.getId()))
                                .findFirst()
                                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
                        existing.setCategoryName(dto.getCategoryName());
                        return existing;
                    } else {
                        // 새로운 카테고리 추가
                        return CategoryEntity.builder()
                                .categoryName(dto.getCategoryName())
                                .tabEntity(tab)
                                .build();
                    }
                }).toList();

        // 5. 기존 리스트를 지우고 새로운 리스트로 교체 (orphanRemoval에 의해 삭제됨)
        existingCategories.clear();
        existingCategories.addAll(updatedCategories);
    }

    @Override
    public void tabDelete(Long id) {
        Optional<TabEntity> optionalTabEntity = tabRepository.findById(id);
        if (optionalTabEntity.isEmpty()) {
            throw new IllegalArgumentException("탭이 존재하지 않습니다");
        }
        tabRepository.deleteById(id);
    }

//   @Override
//   public TabDto tabDetail(Long id) {
//     TabEntity tabEntity = tabRepository.findById(id)
//     .orElseThrow(()->new IllegalArgumentException("탭이 존재하지 않습니다"));
//     return TabDto.builder()
//     .id(tabEntity.getId())
//     .tabName(tabEntity.getTabName())
//     .categoryDtos(tabEntity.getCategoryList().stream().map(cat -> CategoryDto.builder()
//             .id(cat.getId())
//             .categoryName(cat.getCategoryName())
//             .build())
//         .collect(Collectors.toList()))
//     .categoryNames(tabEntity.getCategoryList())
//     .build();
//  }

@Override
public TabDto tabDetail(Long id) {
    TabEntity tabEntity = tabRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("탭이 존재하지 않습니다"));

    // 1. 카테고리 DTO 리스트
    List<CategoryDto> dtos = tabEntity.getCategoryList().stream()
            .map(cat -> CategoryDto.builder()
                    .id(cat.getId())
                    .categoryName(cat.getCategoryName())
                    .build())
            .collect(Collectors.toList());

    // 2. 카테고리 이름 리스트 (String)
    List<String> names = tabEntity.getCategoryList().stream()
            .map(CategoryEntity::getCategoryName) // 여기서 이름만 추출!
            .collect(Collectors.toList());

    return TabDto.builder()
            .id(tabEntity.getId())
            .tabName(tabEntity.getTabName())
            .categoryDtos(dtos)
            .categoryNames(names) // 이제 올바른 List<String>이 들어갑니다.
            .build();
}

@Override
public List<CategoryDto> categoryList() {
        List<CategoryEntity> categoryEntity = categoryRepository.findAll();
        return categoryEntity.stream().map(el->
                CategoryDto.builder()
                .id(el.getId())
                .categoryName(el.getCategoryName())
                .build()
        ).toList();
}
}
