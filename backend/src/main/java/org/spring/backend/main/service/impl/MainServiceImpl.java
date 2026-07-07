package org.spring.backend.main.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.common.Interest;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.service.MainService;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.product.dto.ProductDto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {
    private final CommunityRepository communityRepository;
    private final OrderItemRepository orderItemRepository;

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

        return MainResponseDto.builder()
                .communityList(communityList)
                .productList(productList)
                .noticeList(noticeList)
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

        return MainResponseDto.builder()
                .communityList(communityList)
                .productList(productList)
                .noticeList(noticeList)
                .build();
    }
}
