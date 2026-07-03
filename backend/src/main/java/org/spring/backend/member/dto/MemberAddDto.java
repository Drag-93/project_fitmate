package org.spring.backend.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.spring.backend.common.Gender;
import org.spring.backend.common.Role;
import org.spring.backend.member.entity.MemberEntity;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberAddDto {
    private Long id;

    private float height;

    private float weight;

    private float goalWeight;

    private int dailyCheck;

    private String badge;

    private MemberEntity memberEntity;
}
