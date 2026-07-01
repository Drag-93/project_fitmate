package org.spring.backend.commuTest;

import org.junit.jupiter.api.Test;
import org.spring.backend.community.dto.CategoryDto;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.entity.TabEntity;
import org.spring.backend.community.repository.CategoryRepository;
import org.spring.backend.community.repository.TabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TabTest {
    @Autowired
    TabRepository tabRepository;

    @Autowired
    CategoryRepository categoryRepository;



    @Test
    void insert(){
        for (int i = 0;i<10;i++){
// 1. Tab 먼저 저장
            TabEntity tab = TabEntity.builder().tabName("TN" + i).build();
            TabEntity savedTab = tabRepository.save(tab); // tabRepository 사용

            // 2. Category는 categoryRepository 사용
            CategoryEntity category = CategoryEntity.builder()
                    .categoryName("CN" + i)
                    .tabEntity(savedTab)
                    .build();

            categoryRepository.save(category); // categoryRepository 사용
        }
    }

}
