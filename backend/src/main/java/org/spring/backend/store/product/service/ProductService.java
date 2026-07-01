package org.spring.backend.store.product.service;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;

public interface ProductService {

  void insertProduct(ProductDto productDto);

  void updateProduct(Long productId, ProductDto productDto);

  void deleteProduct(Long productId);

  // 상품 전체 조회
  List<ProductDto> productList();

  // 상품 상세 조회
  ProductDto productDetail(Long productId);

  // 카테고리별 조회
  List<ProductDto> categoryList(String category);

  // 상품 검색
  List<ProductDto> searchProduct(String keyword);
}
