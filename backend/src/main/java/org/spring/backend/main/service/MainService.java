package org.spring.backend.main.service;

import org.spring.backend.main.dto.MainResponseDto;

public interface MainService {

    MainResponseDto defaultMain() ;
// Interest -> Enum으로 만들어서 관리
//    MainResponseDto getMainByInterest(Interest interest);
}
