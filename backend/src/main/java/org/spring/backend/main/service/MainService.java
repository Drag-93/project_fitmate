package org.spring.backend.main.service;

import org.spring.backend.common.Interest;
import org.spring.backend.main.dto.MainResponseDto;

public interface MainService {

// Interest -> Enum으로 만들어서 관리
    MainResponseDto getMainData(Interest interest);

    MainResponseDto getDefaultMainData();
}
