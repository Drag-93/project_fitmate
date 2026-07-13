package org.spring.backend.store.MemberProduct.service;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.store.product.entity.ProductEntity;

public interface MemberProductService {
  void create(MemberEntity memberEntity, ProductEntity productEntity);


}

