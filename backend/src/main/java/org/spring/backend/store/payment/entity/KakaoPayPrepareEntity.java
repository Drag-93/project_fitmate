package org.spring.backend.store.payment.entity;

import org.spring.backend.store.payment.dto.KakaoPayPrepareDto;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KakaoPayPrepareEntity {

    private String tid;
    private String tmsResult;
    private String nextRedirectAppUrl;
    private String nextRedirectMobileUrl;
    private String nextRedirectPcUrl;
    private String androidAppScheme;
    private String iosAppScheme;
    private String createdAt;

    public static KakaoPayPrepareEntity toEntity(KakaoPayPrepareDto kakaoPayPrepareDto) {
        return KakaoPayPrepareEntity.builder()
                .tid(kakaoPayPrepareDto.getTid())
                .tmsResult(kakaoPayPrepareDto.getTms_result())
                .nextRedirectAppUrl(kakaoPayPrepareDto.getNext_redirect_app_url())
                .nextRedirectMobileUrl(kakaoPayPrepareDto.getNext_redirect_mobile_url())
                .nextRedirectPcUrl(kakaoPayPrepareDto.getNext_redirect_pc_url())
                .androidAppScheme(kakaoPayPrepareDto.getAndroid_app_scheme())
                .iosAppScheme(kakaoPayPrepareDto.getIos_app_scheme())
                .createdAt(kakaoPayPrepareDto.getCreated_at())
                .build();

    }


}