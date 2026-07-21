package org.spring.backend.admin.dashboard.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.dashboard.dto.*;
import org.spring.backend.admin.dashboard.service.DashboardService;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.product.entity.ProductEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final OrderItemRepository orderItemRepository;

    @Override
    public DashboardResponseDto getDashboardData() {

        DashboardSummaryDto summary = getSummary();
        DashboardMemberDto member = getMember();

        List<DashboardChartDto> interestChart = getInterestChart();
        List<DashboardChartDto> communityChart = getCommunityChart();
        List<DashboardChartDto> salesChart = getSalesChart();

        List<DashboardCommunityDto> communityList = getCommunityTop5();
        List<DashboardProductDto> productList = getProductTop5();

        return DashboardResponseDto.builder()
                .summary(summary)
                .member(member)
                .interestChart(interestChart)
                .communityChart(communityChart)
                .salesChart(salesChart)
                .communityList(communityList)
                .productList(productList)
                .build();
    }

    /* ==================== Summary ==================== */
    // 대시보드 주요 현황 조회
    private DashboardSummaryDto getSummary() {
        return DashboardSummaryDto.builder()
                .totalMemberCount(0L)
                .totalProductCount(0L)
                .todayCommunityCount(0L)
                .todaySales(0L)
                .monthlySales(0L)
                .build();
    }

    /* ==================== Member ==================== */
    // 회원 및 구독 CRM 조회
    private DashboardMemberDto getMember() {
        return DashboardMemberDto.builder()
                .activeSubscriptionCount(0L)
                .expiringSubscriptionCount(0L)
                .expiredSubscriptionCount(0L)
                .inactiveMemberCount(0L)
                .build();
    }

    /* ==================== Product ==================== */
    // 상품 판매량 TOP 5 조회
// 상품 판매량 TOP 5 조회
    private List<DashboardProductDto> getProductTop5() {
        Pageable pageable = PageRequest.of(0, 5);

        List<Object[]> result =
                orderItemRepository.findPopularProductsWithSalesCount(pageable);

        return result.stream()
                .map(row -> {
                    ProductEntity product = (ProductEntity) row[0];
                    Long salesCount = ((Number) row[1]).longValue();

                    return DashboardProductDto.builder()
                            .id(product.getId())
                            .productName(product.getProductName())
                            .price(product.getPrice())
                            .salesCount(salesCount)
                            .build();
                })
                .toList();
    }

    /* ==================== Community ==================== */
    // 커뮤니티 게시글 TOP 5 조회
    private List<DashboardCommunityDto> getCommunityTop5() {
        return List.of();
    }

    /* ==================== Chart ==================== */
    // 회원 관심사 분포 조회
    private List<DashboardChartDto> getInterestChart() {
        return List.of();
    }

    // 게시글 작성 추이 조회
    private List<DashboardChartDto> getCommunityChart() {
        return List.of();
    }

    // 매출 추이 조회
    private List<DashboardChartDto> getSalesChart() {
        return List.of();
    }



}