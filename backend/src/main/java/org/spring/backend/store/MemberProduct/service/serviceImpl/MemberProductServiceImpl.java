package org.spring.backend.store.MemberProduct.service.serviceImpl;

import java.time.LocalDateTime;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.MemberProduct.entity.MemberProductEntity;
import org.spring.backend.store.MemberProduct.repository.MemberProductRepository;
import org.spring.backend.store.MemberProduct.service.MemberProductService;
import org.spring.backend.store.product.entity.ProductEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberProductServiceImpl implements MemberProductService {
  private final MemberProductRepository memberProductRepository;
  @Override
  public void create(MemberEntity memberEntity, ProductEntity productEntity) {
    MemberProductEntity memberProductEntity = MemberProductEntity.builder()
        .memberEntity(memberEntity)
        .productEntity(productEntity)
        .startDate(LocalDateTime.now())
        .endDate(
            LocalDateTime.now()
                .plusDays(productEntity.getDuration()))
        .totalCount(productEntity.getSessionCount())
        .remainingCount(productEntity.getSessionCount())
        .status("ACTIVE")
        .build();

        memberProductRepository.save(memberProductEntity);
  }

}
