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
        for (int i = 0;i<10;i++){
        CategoryEntity category = categoryRepository.save(CategoryEntity.builder()
                .categoryName("다이어트")
                .build());
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
