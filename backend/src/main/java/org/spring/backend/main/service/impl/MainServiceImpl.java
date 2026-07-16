package org.spring.backend.main.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.common.Interest;
import org.spring.backend.common.TableType;
import org.spring.backend.community.dto.CommunityDto;
import org.spring.backend.community.repository.CommunityRepository;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.file.repository.FileRepository;
import org.spring.backend.main.dto.MainResponseDto;
import org.spring.backend.main.dto.PopupDto;
import org.spring.backend.main.entity.PopupEntity;
import org.spring.backend.main.repository.PopupRepository;
import org.spring.backend.main.service.MainService;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.product.dto.ProductDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private final CommunityRepository communityRepository;
    private final OrderItemRepository orderItemRepository;

    private final PopupRepository popupRepository;
    private final FileRepository fileRepository;
    private final FileHandler fileHandler;

    // 팝업 이미지 저장 경로
    @Value("${img.path.popup}")
    private String popupPath;

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
                        .findTop5ByCategoryNameOrderByCreateTimeDesc("공지사항")
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 공지사항을 제외한 전체 게시글 조회수 높은 순 TOP 5
        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByCategoryNameNotOrderByHitDesc("공지사항")
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
        LocalDateTime now = LocalDateTime.now();

        List<PopupDto> popupList =
                popupRepository
                        .findActivePopup(now)
                        .stream()
                        .map(this::convertPopupDto)
                        .toList();

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
        String communityCategory = interest.getCommunityCategory();

        // 공지사항은 사용자 관심사와 관계없이  최신순 TOP 5 조회
        List<CommunityDto> noticeList =
                communityRepository
                        .findTop5ByCategoryNameOrderByCreateTimeDesc("공지사항")
                        .stream()
                        .map(entity -> CommunityDto.builder()
                                .id(entity.getId())
                                .title(entity.getTitle())
                                .build())
                        .toList();

        // 조회수 높은 순 TOP 5

        List<CommunityDto> communityList =
                communityRepository
                        .findTop5ByCategoryNameOrderByHitDesc(
                                communityCategory
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
        LocalDateTime now = LocalDateTime.now();

        List<PopupDto> popupList =
                popupRepository
                        .findActivePopup(now)
                        .stream()
                        .map(this::convertPopupDto)
                        .toList();

        return MainResponseDto.builder()
                .noticeList(noticeList)
                .communityList(communityList)
                .productList(productList)
                .popupList(popupList)
                .build();
    }

    // ============================================================
    // Main Popup 관련 CRUD
    // ============================================================

    // PopupEntity와 해당 팝업의 FileEntity를 함께 조회
    // PopupDto로 변환하는 공통 메서드
    private PopupDto convertPopupDto(PopupEntity popupEntity) {

        FileEntity fileEntity =
                fileRepository
                        .findByPopupEntity(popupEntity)
                        .orElse(null);

        return PopupDto.toPopupDto(
                popupEntity,
                fileEntity
        );
    }

    // 팝업 등록
    @Transactional
    @Override
    public void insertPopup(PopupDto popupDto) throws IOException {

        PopupEntity popupEntity =
                PopupEntity.toInsertPopupEntity(popupDto);

        //PopupEntity를 먼저 저장합니다.
        PopupEntity savedPopup =
                popupRepository.save(popupEntity);

        // 실제 파일이 존재할 때만 파일 저장
        if (popupDto.getAttachFile() != null
                && !popupDto.getAttachFile().isEmpty()) {

            fileHandler.insertFile(
                    popupPath,
                    TableType.POPUP,
                    savedPopup.getId(),
                    popupDto.getAttachFile()
            );
        }
    }

    // 관리자 팝업 전체 목록 조회
//    @Transactional(readOnly = true)
//    @Override
//    public List<PopupDto> popupList() {
//
//        return popupRepository
//                .findAll()
//                .stream()
//                .map(this::convertPopupDto)
//                .toList();
//    }
    @Transactional(readOnly = true)
    @Override
    public Page<PopupDto> popupList(Pageable pageable, String subject, String search) {
        if(subject==null||subject.isBlank()||search==null||search.isBlank()){
            return popupRepository.findAll(pageable).map(this::convertPopupDto);
        }
        Page<PopupEntity> popupEntities = null;
        //멤버리스트 검색필터링기능
        switch (subject){
//            case "endDate":
//                popupEntities = popupRepository.findByEndDateContaining(pageable, search);
//                break;
//            case "startDate":
//                popupEntities = popupRepository.findByStartDateContaining(pageable, search);
//                break;
            case "active":
                popupEntities = popupRepository.findByActiveContaining(pageable, search);
                break;
            case "sortOrder":
                popupEntities = popupRepository.findBysortOrderContaining(pageable, search);
                break;
            default:
                popupEntities = popupRepository.findAll(pageable);
        }
        return popupEntities.map(this::convertPopupDto);
    }



    //팝업 상세 조회
    @Transactional(readOnly = true)
    @Override
    public PopupDto popupDetail(Long id) {

        PopupEntity popupEntity =
                popupRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("해당 팝업이 없습니다. id=" + id));

        return convertPopupDto(popupEntity);
    }

    // 팝업 수정
    @Transactional
    @Override
    public void updatePopup(PopupDto popupDto) throws IOException {

        PopupEntity popupEntity =
                popupRepository
                        .findById(popupDto.getId())
                        .orElseThrow(() ->
                                        new IllegalArgumentException("해당 팝업이 없습니다. id=" + popupDto.getId()));

        //팝업 정보 수정
        popupEntity.toUpdatePopup(popupDto);

        // 새 이미지가 선택된 경우에만 파일 교체
        if (popupDto.getAttachFile() != null
                && !popupDto.getAttachFile().isEmpty()) {

            fileHandler.insertFile(
                    popupPath,
                    TableType.POPUP,
                    popupEntity.getId(),
                    popupDto.getAttachFile()
            );
        }
    }

    // 팝업 삭제
    // 실제 파일과 FileEntity를 먼저 후 PopupEntity 삭제
    @Transactional
    @Override
    public void deletePopup(Long id) throws IOException {
        System.out.println("백엔드 팝업 삭제 실행");
        PopupEntity popupEntity =
                popupRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("해당 팝업이 없습니다. id=" + id));
        //실제 저장 파일과 FileEntity 삭제
        Optional<FileEntity> fileEntity=fileRepository.findByPopupEntity(popupEntity);
        if(fileEntity.isPresent()){

            fileHandler.deleteFile(
                    popupPath,
                    TableType.POPUP,
                    id);
        }

        // 팝업 정보 삭제
        popupRepository.delete(popupEntity);
    }
}