package org.spring.backend.main.dto;

import lombok.*;
import org.spring.backend.main.entity.PopupEntity;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopupDto {
    private Long id;
    //팝업 제목
    private String title;
    //팝업 내용
    private String content;
    //클릭 시 이동할 주소
    private String linkUrl;
    //노출 여부  //관리자가 ON/OFF 가능
    private Boolean active;
    //노출 순서  //여러 팝업일 때 우선순위
    private Integer sortOrder;
    //노출 시작일  //예약 오픈
    private LocalDateTime startDate;
    //노출 종료일  //자동 종료
    private LocalDateTime endDate;
    //업로드한 원본 파일명
    private String attachFile;
    //서버 저장 파일명
    private String newFileName;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public static PopupDto toPopupDto(PopupEntity popupEntity) {
        return PopupDto.builder()
                .id(popupEntity.getId())
                .title(popupEntity.getTitle())
                .content(popupEntity.getContent())
                .attachFile(popupEntity.getAttachFile())
                .newFileName(popupEntity.getNewFileName())
                .linkUrl(popupEntity.getLinkUrl())
                .active(popupEntity.getActive())
                .startDate(popupEntity.getStartDate())
                .endDate(popupEntity.getEndDate())
                .sortOrder(popupEntity.getSortOrder())
                .createTime(popupEntity.getCreateTime())
                .updateTime(popupEntity.getUpdateTime())
                .build();
    }
}
