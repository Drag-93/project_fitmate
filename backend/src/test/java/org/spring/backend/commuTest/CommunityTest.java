package org.spring.backend.commuTest;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.spring.backend.community.entity.CategoryEntity;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.community.repository.CategoryRepository;
import org.spring.backend.community.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CommunityTest {
    @Autowired
    CommunityRepository communityRepository;

    @Autowired
    CategoryRepository categoryRepository;



    @Test
    void insert(){
        CategoryEntity category = categoryRepository.save(CategoryEntity.builder()
                .categoryName("테스트 카테고리")
                .build());
        for (int i = 0;i<10;i++){
            communityRepository.save(CommunityEntity.builder()
                    .title("Title" + i)
                    .writerName("writer" + i)
                    .content("content" + i)
                    .categoryEntity(category)
                    .hasFile(0)
                    .hit(0)
                    .reply(0)
                    .build());
        }
    }

}
