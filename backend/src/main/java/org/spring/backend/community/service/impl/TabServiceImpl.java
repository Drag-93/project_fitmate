package org.spring.backend.community.service.impl;

import java.util.List;
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
        }).collect(Collectors.toList()); // 여기를 수정!
    }

    @Override
    @Transactional
    public void tabUpdate(TabDto tabDto) {
//    TabEntity tab = tabRepository.findById(tabDto.getId())
//    .orElseThrow(()->new IllegalArgumentException("탭이 존재하지 않습니다"));
//     for (CategoryDto catDto : tabDto.getCategoryDtos()) {
//         if (catDto.getId() == null) {
//             // 1. ID가 없으면? -> 새로 추가된 카테고리
//             categoryRepository.save(CategoryEntity.builder()
//                     .categoryName(catDto.getCategoryName())
//                     .tabEntity(tab)
//                     .build());
//         } else {
//             // 2. ID가 있으면? -> 기존 카테고리 이름 수정
//             CategoryEntity category = categoryRepository.findById(catDto.getId())
//                     .orElseThrow();
//             category.setCategoryName(catDto.getCategoryName());
//         }
//     }
//    tab.setTabName(tabDto.getTabName()); // 탭 이름 수정

//    // 1. 요청받은 ID 목록 추출
//    List<Long> requestIds = tabDto.getCategoryDtos().stream()
//        .map(CategoryDto::getId)
//        .filter(id -> id != null)
//        .collect(Collectors.toList());
//
//    // 2. 요청 목록에 없는 기존 카테고리 삭제 (DB에서 삭제)
//    tab.getCategoryList().removeIf(cat -> !requestIds.contains(cat.getId()));
//
//    // 3. 기존 카테고리 수정 및 새 카테고리 추가
//    for (CategoryDto catDto : tabDto.getCategoryDtos()) {
//        if (catDto.getId() == null) {
//            categoryRepository.save(CategoryEntity.builder()
//                .categoryName(catDto.getCategoryName())
//                .tabEntity(tab)
//                .build());
//        } else {
//            CategoryEntity category = categoryRepository.findById(catDto.getId()).orElseThrow();
//            category.setCategoryName(catDto.getCategoryName());
//        }
//    }
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
}
