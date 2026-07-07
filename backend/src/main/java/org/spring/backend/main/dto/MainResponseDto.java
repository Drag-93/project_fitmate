package org.spring.backend.main.dto;

import lombok.*;
import org.spring.backend.community.entity.CommunityEntity;
import org.spring.backend.store.product.entity.ProductEntity;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MainResponseDto {

    List<CommunityEntity> communityList;

    List<ProductEntity> productList;

}
