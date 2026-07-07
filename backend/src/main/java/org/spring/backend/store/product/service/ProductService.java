package org.spring.backend.store.product.service;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

  void insertProduct(ProductDto productDto);

  void updateProduct(Long productId, ProductDto productDto);

  void deleteProduct(Long productId);

  // 상품 상세 조회
  ProductDto productDetail(Long productId);

  // 카테고리별 조회, 전체조회
  Page<ProductDto> productList(ProductType productType, Pageable pageable);

  // 상품 검색
  Page<ProductDto> searchProduct(String keyword, Pageable pageable);

}
