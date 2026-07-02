package org.spring.backend.store.product.service.serviceImpl;

import java.io.IOException;
import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.product.service.ProductService;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;

  @Override
  public void insertProduct(ProductDto productDto) {

    ProductEntity productEntity = ProductEntity.builder()
        .productName(productDto.getProductName())
        .price(productDto.getPrice())
        .description(productDto.getDescription())
        .productType(productDto.getProductType())
        .billingType(productDto.getBillingType())
        .productStatus(productDto.getProductStatus())
        .build();

    productRepository.save(productEntity);
  }

  @Override
  public void updateProduct(Long productId, ProductDto productDto) {

    ProductEntity productEntity = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    productEntity.setProductName(productDto.getProductName());
    productEntity.setPrice(productDto.getPrice());
    productEntity.setDescription(productDto.getDescription());
    productEntity.setProductType(productDto.getProductType());
    productEntity.setBillingType(productDto.getBillingType());
    productEntity.setProductStatus(productDto.getProductStatus());

    productRepository.save(productEntity);
  }

  @Override
  public void deleteProduct(Long productId) {

    productRepository.deleteById(productId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductDto> productList() {
    return productRepository.findAll()
        .stream()
        .map(ProductDto::toProductDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public ProductDto productDetail(Long productId) {

    ProductEntity productEntity = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    return ProductDto.toProductDto(productEntity);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductDto> categoryList(ProductType productType) {

    return productRepository.findByProductType(productType)
        .stream()
        .map(ProductDto::toProductDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductDto> searchProduct(String keyword) {
    return productRepository.findByProductNameContaining(keyword)
        .stream()
        .map(ProductDto::toProductDto)
        .toList();
  }


}
