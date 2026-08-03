package org.spring.backend.admin.popup.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.backend.admin.popup.dto.PopupDto;
import org.spring.backend.admin.popup.entity.PopupEntity;
import org.spring.backend.admin.popup.repository.PopupRepository;
import org.spring.backend.admin.popup.service.PopupService;
import org.spring.backend.file.enumtype.TableType;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.file.repository.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PopupServiceImpl implements PopupService {
    private final PopupRepository popupRepository;
    private final FileRepository fileRepository;
    private final FileHandler fileHandler;

    // 팝업 이미지 저장 경로
    @Value("${img.path.popup}")
    private String popupPath;

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

// 관리자 팝업 목록 조회
// 1. status 값에 따라 전체 / 노출 / 미노출 목록을 구분
// 2. search 값이 있으면 제목 검색 적용
// 3. sortType 값에 따라 노출 순서 또는 노출 시작일 기준 정렬
// 4. 정렬이 적용된 Pageable로 Repository 조회
// 5. 조회된 PopupEntity를 PopupDto로 변환
@Transactional(readOnly = true)
@Override
public Page<PopupDto> popupList(
        Pageable pageable,
        String status,
        String sortType,
        String search
) {

        LocalDateTime now = LocalDateTime.now();

        // status가 없으면 전체 조회
        String normalizedStatus =
                status == null || status.isBlank()
                        ? "ALL"
                        : status.toUpperCase();

        // 검색어가 없으면 빈 문자열로 처리
        String normalizedSearch =
                search == null
                        ? ""
                        : search.trim();

        // 정렬 조건 생성
        Sort sort = switch (
                sortType == null ? "" : sortType.toUpperCase()
                ) {
            // 노출 순서 높은 값부터
            case "SORT_ORDER_DESC" ->
                    Sort.by(
                            Sort.Order.desc("sortOrder"),
                            Sort.Order.desc("id")
                    );

            // 노출 시작일 오래된 순
            case "START_DATE_ASC" ->
                    Sort.by(
                            Sort.Order.asc("startDate"),
                            Sort.Order.desc("id")
                    );

            // 노출 시작일 최신 순
            case "START_DATE_DESC" ->
                    Sort.by(
                            Sort.Order.desc("startDate"),
                            Sort.Order.desc("id")
                    );

            // 기본값: 노출 순서 낮은 값부터
            default ->
                    Sort.by(
                            Sort.Order.asc("sortOrder"),
                            Sort.Order.desc("id")
                    );
        };

        // 전달받은 페이지 번호와 페이지 크기에 정렬 조건 적용
        Pageable sortedPageable =
                PageRequest.of(
                        pageable.getPageNumber(),
                        pageable.getPageSize(),
                        sort
                );

        // status 값에 따라 Repository 조회 메서드 분기
        Page<PopupEntity> popupEntities =
                switch (normalizedStatus) {

                    // 현재 실제 노출 중인 팝업
                    case "VISIBLE" ->
                            popupRepository.findVisiblePopupList(
                                    now,
                                    normalizedSearch,
                                    sortedPageable
                            );

                    // 현재 실제 미노출 상태인 팝업
                    case "HIDDEN" ->
                            popupRepository.findHiddenPopupList(
                                    now,
                                    normalizedSearch,
                                    sortedPageable
                            );

                    // 전체 팝업
                    default -> {
                        if (normalizedSearch.isBlank()) {
                            yield popupRepository.findAll(sortedPageable);
                        }

                        yield popupRepository.findByTitleContaining(
                                normalizedSearch,
                                sortedPageable
                        );
                    }
                };

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
//        System.out.println("백엔드 팝업 삭제 실행");
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

    //활성화된 popup 조회
    @Override
    @Transactional(readOnly = true)
    public List<PopupDto> getActivePopupList() {

        LocalDateTime now = LocalDateTime.now();

        return popupRepository
                .findActivePopup(now)
                .stream()
                .map(this::convertPopupDto)
                .toList();
    }
}
