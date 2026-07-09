package org.spring.backend.main.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.common.Interest;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.dto.PopupDto;
import org.spring.backend.main.entity.PopupEntity;
import org.spring.backend.main.repository.PopupRepository;
import org.spring.backend.main.service.MainService;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.product.dto.ProductDto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {
    private final CommunityRepository communityRepository;
    private final OrderItemRepository orderItemRepository;
//============================================================
//  Main 추천기능
//============================================================
    @Override
    public MainResponseDto getDefaultMainData() {
        //비회원용: 공지사항 최근순 TOP 5, 전체 게시글(공지사항 제외) 조회수 TOP 5
        List<CommunityDto> noticeList =
                communityRepository
                        .findTop5ByCategoryNameOrderByCreateTimeDesc("notice")
                        .stream()
                        .map(CommunityDto::new)
                        .toList();

        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByCategoryNameNotOrderByHitDesc("notice")
                        .stream()
                        .map(CommunityDto::new)
                        .toList();

        // 비회원용: 전체 상품 중 판매량 높은 TOP 5
        Pageable pageable = PageRequest.of(0, 5);

        List<ProductDto> productList =
                orderItemRepository.findPopularProducts(pageable)
                        .stream()
                        .map(ProductDto::toProductDto)
                        .toList();

        //현재일 기준 활성화된 팝업리스트
        LocalDateTime now= LocalDateTime.now();

        List<PopupDto> popupList =
                popupRepository.findActivePopup(now)
                        .stream()
                        .map(PopupDto::toPopupDto)
                        .toList();


        return MainResponseDto.builder()
                .communityList(communityList)
                .productList(productList)
                .noticeList(noticeList)
                .popupList(popupList)
                .build();
    }

    @Override
    public MainResponseDto getMainData(Interest interest) {

        String productCategory = interest.getProductCategory();
        String communityCategory = interest.getCommunityCategory();

        List<CommunityDto> noticeList =
                communityRepository
                        .findTop5ByCategoryNameOrderByCreateTimeDesc("notice")
                        .stream()
                        .map(CommunityDto::new)
                        .toList();

        // Interest 기반 커뮤니티 TOP 5
        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByCategoryNameOrderByHitDesc(communityCategory)
                        .stream()
                        .map(CommunityDto::new)
                        .toList();

        // Interest 기반 상품 판매량 TOP 5
        Pageable pageable = PageRequest.of(0, 5);

        List<ProductDto> productList =
                orderItemRepository
                        .findPopularProductsByCategory(productCategory, pageable)
                        .stream()
                        .map(ProductDto::toProductDto)
                        .toList();

        //현재일 기준 활성화된 팝업리스트
        LocalDateTime now= LocalDateTime.now();

        List<PopupDto> popupList =
                popupRepository.findActivePopup(now)
                        .stream()
                        .map(PopupDto::toPopupDto)
                        .toList();

        return MainResponseDto.builder()
                .communityList(communityList)
                .productList(productList)
                .noticeList(noticeList)
                .popupList(popupList)
                .build();
    }

//============================================================
//  Main Popup 관련 CRUD
// ============================================================
    private final PopupRepository popupRepository;
    @Override
    public void insertPopup(PopupDto popupDto) {
        PopupEntity popupEntity= PopupEntity.toInsertPopupEntity(popupDto);
        popupRepository.save(popupEntity);
    }


    // popup 전체 내용이 많지 않아서 findAll 사용 -> Pageable 사용해야 할 수도 있음
    @Override
    @Transactional(readOnly = true)
    public List<PopupDto> popupList() {
        List<PopupEntity> popupEntityList = popupRepository.findAll();

        return popupEntityList.stream()
                .map(PopupDto::toPopupDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PopupDto popupDetail(Long id) {
        PopupEntity popupEntity = popupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 팝업이 없습니다. id=" + id));

        return PopupDto.toPopupDto(popupEntity);
    }

    @Override
    public void updatePopup(PopupDto popupDto) {
        PopupEntity popupEntity = popupRepository.findById(popupDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 팝업이 없습니다. id=" + popupDto.getId()));

        PopupEntity updatePopupEntity = PopupEntity.toUpdatePopupEntity(popupDto);

        popupRepository.save(updatePopupEntity);
    }

    @Override
    public void deletePopup(Long id) {
        PopupEntity popupEntity = popupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 팝업이 없습니다. id=" + id));
        popupRepository.deleteById(id);
    }

}
