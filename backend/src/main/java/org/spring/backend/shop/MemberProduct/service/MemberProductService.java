package org.spring.backend.store.MemberProduct.service;

import java.time.LocalDate;
import java.util.List;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.MemberProduct.dto.MemberProductDto;
import org.spring.backend.store.product.entity.ProductEntity;

public interface MemberProductService {
  void create(MemberEntity memberEntity, ProductEntity productEntity, LocalDate startDate);

  public List<MemberProductDto> getActivePtProducts(String email);


}

