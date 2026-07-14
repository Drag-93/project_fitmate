package org.spring.backend.popupTest;

import org.junit.jupiter.api.Test;
import org.spring.backend.main.dto.PopupDto;
import org.spring.backend.main.service.MainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.time.LocalDateTime;

@SpringBootTest
public class PopupTest {
    @Autowired
    MainService mainService;

    @Test
    void insertPopup() throws IOException{
        for(int i=1; i<5; i++){
            PopupDto popupDto = PopupDto.builder()
                    .active(true)
                    .title("팝업 테스트 " + i)
                    .content("팝업 내용 테스트 " + i)
                    .linkUrl("/store")
                    .startDate(LocalDateTime.now())
                    .endDate(LocalDateTime.now().plusDays(10))
                    .sortOrder(i)
                    .build();

            mainService.insertPopup(popupDto);

        }
    }
}
