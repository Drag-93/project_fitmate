package org.spring.backend.main.entity;

import jakarta.persistence.*;
import lombok.*;
import org.spring.backend.common.BasicTime;
import org.spring.backend.file.entity.FileEntity;
import org.spring.backend.main.dto.PopupDto;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "popup_tb")
public class PopupEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "popup_id")
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
    //파일엔티티와 1:N 매핑
    @OneToMany(mappedBy = "popupEntity",
            fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<FileEntity> fileEntities;

    public static PopupEntity toInsertPopupEntity(PopupDto popupDto) {
        return PopupEntity.builder()
                .title(popupDto.getTitle())
                .content(popupDto.getContent())
                .attachFile(popupDto.getAttachFile())
                .newFileName(popupDto.getNewFileName())
                .linkUrl(popupDto.getLinkUrl())
                .active(popupDto.getActive())
                .startDate(popupDto.getStartDate())
                .endDate(popupDto.getEndDate())
                .sortOrder(popupDto.getSortOrder())
                .build();
    }
    public static PopupEntity toUpdatePopupEntity(PopupDto popupDto) {
        return PopupEntity.builder()
                .id(popupDto.getId())
                .title(popupDto.getTitle())
                .content(popupDto.getContent())
                .attachFile(popupDto.getAttachFile())
                .newFileName(popupDto.getNewFileName())
                .linkUrl(popupDto.getLinkUrl())
                .active(popupDto.getActive())
                .startDate(popupDto.getStartDate())
                .endDate(popupDto.getEndDate())
                .sortOrder(popupDto.getSortOrder())
                .build();
    }
}