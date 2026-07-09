package org.spring.backend.store.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResultDto {

    private Long paymentResultId;
    private Long paymentId;
    private Long memberId;
    private String productName;
    private Long productPrice;
}