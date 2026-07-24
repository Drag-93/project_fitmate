package org.spring.backend.chatbot.config;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
public class KomoranConfig {

    @Bean
    public Komoran komoran(){
        //기본 라이트 모델 인스턴스 생성
        Komoran komoran = new Komoran(DEFAULT_MODEL.LIGHT);

        //사용자 사전 주입 절차(기본 제공 사전 이외의 것들 등록필요시)
        try{
            //ClassPath기준으로 src/main/resource/user.dic파일 로드
             ClassPathResource resource = new ClassPathResource("user.dic");
            String userDicPath = resource.getFile().getAbsolutePath();

            //코모란 인스턴스에 사용자 사전 주입
            komoran.setUserDic(userDicPath);
            System.out.println("코모란 사용자 사전 주입 성공");
        }catch (IOException e){
            System.err.println("코모란 사용자 사전 로드 실패: " + e.getMessage());
        }
        return komoran;
    }
}
