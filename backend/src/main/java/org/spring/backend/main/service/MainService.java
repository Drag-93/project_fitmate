package org.spring.backend.main.service;

import org.spring.backend.member.enumtype.Interest;
import org.spring.backend.main.dto.MainResponseDto;

public interface MainService {

    // Interest -> Enum으로 만들어서 관리
    //메인 추천기능-로그인
    MainResponseDto getMainData(Interest interest);
    //메인 추천기능-비로그인
    MainResponseDto getDefaultMainData();


}
