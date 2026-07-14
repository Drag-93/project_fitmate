package org.spring.backend.main.service;

import org.spring.backend.common.Interest;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.dto.PopupDto;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

public interface MainService {

    // Interest -> Enum으로 만들어서 관리
    //메인 추천기능-로그인
    MainResponseDto getMainData(Interest interest);
    //메인 추천기능-비로그인
    MainResponseDto getDefaultMainData();

    // 팝업 등록
    void insertPopup(PopupDto popupDto) throws IOException;
    // 관리자 팝업 전체 목록 조회
    List<PopupDto> popupList();
    //팝업 상세 조회
    PopupDto popupDetail(Long id);
    // 팝업 수정
    void updatePopup(PopupDto popupDto) throws IOException;
    // 팝업 삭제
    void deletePopup(Long id) throws IOException;
}
