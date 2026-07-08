package org.spring.backend.store.product.controller;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.service.ProductService;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
  public ResponseEntity<Void> insertProduct(
      @RequestPart("productDto") ProductDto productDto,
      @RequestPart(value="thumbnail", required=false) MultipartFile thumbnail,
      @RequestPart(value="main", required=false) List<MultipartFile> main,
      @RequestPart(value="details", required = false) List<MultipartFile> details) {
    productService.insertProduct(productDto, thumbnail, main, details);
    return ResponseEntity.ok().build();
  }

  // 상품수정
  @PutMapping("/{productId}")
  public ResponseEntity<Void> updateProduct(
      @PathVariable("productId") Long productId,
      @RequestPart("productDto") ProductDto productDto,
      @RequestPart(value="thumbnail", required=false) MultipartFile thumbnail,
      @RequestPart(value="main", required=false) List<MultipartFile> main,
      @RequestPart(value="details", required = false) List<MultipartFile> details) {
    productService.updateProduct(productId, productDto, thumbnail, main, details);
    return ResponseEntity.ok().build();
  }

  // 상품 자체를 삭제
  @DeleteMapping("/{productId}")
  public ResponseEntity<Void> deleteProduct(@PathVariable("productId") Long productId) {
    productService.deleteProduct(productId);
    return ResponseEntity.ok().build();
  }

  // 상품사진 전체 삭제
  @DeleteMapping("/{productId}/images")
  public ResponseEntity<Void> deleteAllImages(
      @PathVariable("productId") Long productId) {

    productService.deleteAllImages(productId);

    return ResponseEntity.ok().build();
  }

  // 상품 한장만 삭제
  @DeleteMapping("/image/{productFileId}")
  public ResponseEntity<Void> deleteImage(
      @PathVariable("productFileId") Long productFileId) {

    productService.deleteImage(productFileId);

    return ResponseEntity.ok().build();
  }

  // 카테고리별 상품 조회, 전체조회
  @GetMapping
  public ResponseEntity<Page<ProductDto>> productList(
      @RequestParam(value = "productType", required = false) ProductType productType,
      Pageable pageable) {

    return ResponseEntity.ok(
        productService.productList(productType, pageable));
  }
}