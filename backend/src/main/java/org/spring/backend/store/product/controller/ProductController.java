package org.spring.backend.store.product.controller;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.service.ProductService;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  // 상품 상세 조회
  @GetMapping("/{productId}")
  public ResponseEntity<ProductDto> productDetail(@PathVariable("productId") Long productId) {
    return ResponseEntity.ok(productService.productDetail(productId));
  }

  // 상품 등록
  @PostMapping
  public ResponseEntity<Void> insertProduct(@RequestBody ProductDto productDto) {
    productService.insertProduct(productDto);
    return ResponseEntity.ok().build();
  }

  // 상품수정
  @PutMapping("/{productId}")
  public ResponseEntity<Void> updateProduct(
      @PathVariable("productId") Long productId,
      @RequestBody ProductDto productDto) {

    productService.updateProduct(productId, productDto);
    return ResponseEntity.ok().build();
  }

  // 상품삭제
  @DeleteMapping("/{productId}")
  public ResponseEntity<Void> deleteProduct(@PathVariable("productId") Long productId) {
    productService.deleteProduct(productId);
    return ResponseEntity.ok().build();
  }

  // 카테고리별 상품 조회, 전체조회
  @GetMapping
  public ResponseEntity<Page<ProductDto>> productList(
      @RequestParam(value = "productType",required = false) ProductType productType,
      Pageable pageable) {

    return ResponseEntity.ok(
        productService.productList(productType, pageable));
  }
}