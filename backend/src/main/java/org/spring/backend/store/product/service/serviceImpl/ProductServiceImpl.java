package org.spring.backend.store.product.service.serviceImpl;

import java.io.IOException;
import java.util.List;

import org.spring.backend.common.TableType;
import org.spring.backend.file.handler.FileHandler;
import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.product.service.ProductService;
import org.spring.backend.store.product.type.ImageType;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  @Value("${img.path.product}")
  private String itemPath;

  private final ProductRepository productRepository;

  private final FileHandler fileHandler;

  @Override
  public void insertProduct(ProductDto productDto, MultipartFile thumbnail, List<MultipartFile> main,
      List<MultipartFile> details) {

    ProductEntity productEntity = ProductEntity.builder()
        .productName(productDto.getProductName())
        .price(productDto.getPrice())
        .description(productDto.getDescription())
        .productType(productDto.getProductType())
        .billingType(productDto.getBillingType())
        .productStatus(productDto.getProductStatus())
        .category(productDto.getCategory())
        .duration(productDto.getDuration())
        .sessionCount(productDto.getSessionCount())
        .build();

    productRepository.save(productEntity);

    try {
      fileHandler.insertFile(
          itemPath,
          TableType.PRODUCT,
          productEntity.getId(),
          thumbnail,
          ImageType.THUMBNAIL,
          1);

      if (main != null) {
        for (int i = 0; i < main.size(); i++) {
          fileHandler.insertFile(
              itemPath,
              TableType.PRODUCT,
              productEntity.getId(),
              main.get(i),
              ImageType.MAIN,
              i + 1);
        }
      }
      if (details != null) {
        for (int i = 0; i < details.size(); i++) {
          fileHandler.insertFile(
              itemPath,
              TableType.PRODUCT,
              productEntity.getId(),
              details.get(i),
              ImageType.DETAIL,
              i + 1);
        }
      }

    } catch (IOException e) {
      throw new RuntimeException(e);
    }

  }

  @Override
  public void updateProduct(Long productId, ProductDto productDto, MultipartFile thumbnail, List<MultipartFile> main,
      List<MultipartFile> details) {

    ProductEntity productEntity = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    productEntity.setProductName(productDto.getProductName());
    productEntity.setPrice(productDto.getPrice());
    productEntity.setDescription(productDto.getDescription());
    productEntity.setProductType(productDto.getProductType());
    productEntity.setBillingType(productDto.getBillingType());
    productEntity.setProductStatus(productDto.getProductStatus());
    productEntity.setCategory(productDto.getCategory());
    productEntity.setDuration(productDto.getDuration());
    productEntity.setSessionCount(productDto.getSessionCount());

    productRepository.save(productEntity);
    try {
      fileHandler.insertFile(
          itemPath,
          TableType.PRODUCT,
          productEntity.getId(),
          thumbnail,
          ImageType.THUMBNAIL,
          1);

      if (main != null) {
        for (int i = 0; i < main.size(); i++) {
          fileHandler.insertFile(
              itemPath,
              TableType.PRODUCT,
              productEntity.getId(),
              main.get(i),
              ImageType.MAIN,
              i + 1);
        }
      }
      if (details != null) {
        for (int i = 0; i < details.size(); i++) {
          fileHandler.insertFile(
              itemPath,
              TableType.PRODUCT,
              productEntity.getId(),
              details.get(i),
              ImageType.DETAIL,
              i + 1);
        }
      }

    } catch (IOException e) {
      throw new RuntimeException(e);
    }

  }

  @Override
  public void deleteProduct(Long productId) {
    try {
      fileHandler.deleteProductFiles(itemPath, productId);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    productRepository.deleteById(productId);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ProductDto> productList(ProductType productType, Pageable pageable) {

    Page<ProductEntity> page;

    if (productType == null) {
      page = productRepository.findAll(pageable);
    } else {
      page = productRepository.findByProductType(productType, pageable);
    }

    return page.map(ProductDto::toProductDto);
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
  public Page<ProductDto> searchProduct(String keyword, Pageable pageable) {

    return productRepository
        .findByProductNameContaining(keyword, pageable)
        .map(ProductDto::toProductDto);
  }

  @Override
  public void deleteImage(Long productFileId) {

    try {
      fileHandler.deleteSingleFile(productFileId, itemPath);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

}
