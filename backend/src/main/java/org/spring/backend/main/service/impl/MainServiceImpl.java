package org.spring.backend.main.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.popup.service.PopupService;
import org.spring.backend.member.enumtype.Interest;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.admin.popup.dto.PopupDto;
import org.spring.backend.main.service.MainService;
import org.spring.backend.shop.order.repository.OrderItemRepository;
import org.spring.backend.shop.product.dto.ProductDto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private final CommunityRepository communityRepository;
    private final OrderItemRepository orderItemRepository;
    private final PopupService popupService;
    // ============================================================
    // Main 추천 기능
    // ============================================================

    // 비로그인 사용자용 메인 데이터 조회
    @Override
    @Transactional(readOnly = true)
    public MainResponseDto getDefaultMainData() {

        // 공지사항 최신순 TOP 5
        List<CommunityDto> noticeList =
                communityRepository
                        .findTop5ByTabNameOrderByCreateTimeDesc("공지사항")
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 공지사항을 제외한 전체 게시글 조회수 높은 순 TOP 5
        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByTabNameNotOrderByHitDesc("공지사항")
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 전체 상품 중 판매량 높은 TOP 5
        Pageable pageable = PageRequest.of(0, 5);

        List<ProductDto> productList =
                orderItemRepository
                        .findPopularProducts(pageable)
                        .stream()
                        .map(entity -> ProductDto.builder()
                                .id(entity.getId())
                                .productName(entity.getProductName())
                                .price(entity.getPrice())
          //   썸네일 추가        .thumbnail(...)
                                .build())
                        .toList();

        // 현재 시간 기준으로 노출 가능한 팝업 조회
        List<PopupDto> popupList =
                popupService.getActivePopupList();

        return MainResponseDto.builder()
                .noticeList(noticeList)
                .communityList(communityList)
                .productList(productList)
                .popupList(popupList)
                .build();
    }

    // 로그인 사용자 관심사 기반 메인 데이터 조회
    @Override
    @Transactional(readOnly = true)
    public MainResponseDto getMainData(Interest interest) {

        String productCategory = interest.getProductCategory();
        String communityTabName = interest.getCommunityTabName();

        // 공지사항은 사용자 관심사와 관계없이  최신순 TOP 5 조회
        List<CommunityDto> noticeList =
                communityRepository
                        .findTop5ByTabNameOrderByCreateTimeDesc("공지사항")
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 조회수 높은 순 TOP 5

        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByTabNameOrderByHitDesc(
                                communityTabName
                        )
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 판매량 높은 상품 TOP 5
        Pageable pageable = PageRequest.of(0, 5);

        List<ProductDto> productList =
                orderItemRepository
                        .findPopularProductsByCategory(
                                productCategory,
                                pageable
                        )
                        .stream()
                        .map(entity -> ProductDto.builder()
                                .id(entity.getId())
                                .productName(entity.getProductName())
                                .price(entity.getPrice())
         //    썸네일 추가        .thumbnail(...)
                                .build())
                        .toList();

        // 현재 시간 기준으로 노출 가능한 팝업 조회
        List<PopupDto> popupList =
                popupService.getActivePopupList();

        return MainResponseDto.builder()
                .noticeList(noticeList)
                .communityList(communityList)
                .productList(productList)
                .popupList(popupList)
                .build();
    }

    // 게시판 탭별 베스트 게시글 조회
    @Override
    @Transactional(readOnly = true)
    public List<CommunityDto> getBestCommunityList(String tabName) {

        return communityRepository
                .findTop5ByTabNameOrderByHitDesc(tabName)
                .stream()
                .map(entity -> CommunityDto.builder()
                        .id(entity.getId())
                        .title(entity.getTitle())
                        .build())
                .toList();
    }

}