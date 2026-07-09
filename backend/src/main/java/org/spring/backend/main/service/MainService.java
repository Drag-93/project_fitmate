package org.spring.backend.main.service;

import org.spring.backend.common.Interest;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.dto.PopupDto;
import java.util.List;

public interface MainService {

// Interest -> Enum으로 만들어서 관리
    MainResponseDto getMainData(Interest interest);

    MainResponseDto getDefaultMainData();

    void insertPopup(PopupDto popupDto);

    List<PopupDto> popupList();

    PopupDto popupDetail(Long id);

    void updatePopup(PopupDto popupDto);

    void deletePopup(Long id);


}
