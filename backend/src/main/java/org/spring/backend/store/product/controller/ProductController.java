package org.spring.backend.store.product.controller;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.service.ProductService;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

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

  // 상품 전체 조회
  @GetMapping
  public ResponseEntity<List<ProductDto>> productList() {
    return ResponseEntity.ok(productService.productList());
  }

  // 상품 상세 조회
  @GetMapping("/{productId}")
  public ResponseEntity<ProductDto> productDetail(@PathVariable Long productId) {
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
      @PathVariable Long productId,
      @RequestBody ProductDto productDto) {

    productService.updateProduct(productId, productDto);
    return ResponseEntity.ok().build();
  }

  // 상품삭제
  @DeleteMapping("/{productId}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
    productService.deleteProduct(productId);
    return ResponseEntity.ok().build();
  }

  // 카테고리별 상품 조회
  @GetMapping("/category/{categoryId}")
  public ResponseEntity<List<ProductDto>> productByCategory(@PathVariable ProductType category) {
    return ResponseEntity.ok(productService.categoryList(category));
  }
}