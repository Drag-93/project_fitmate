package org.spring.backend.store.product.service.serviceImpl;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.entity.ProductFileEntity;
import org.spring.backend.store.product.repository.ProductFileRepository;
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
  private final ProductFileRepository productFileRepository;

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
        .build();

    productRepository.save(productEntity);

    saveFile(thumbnail, productEntity, ImageType.THUMBNAIL, 1);

    if (main != null) {
      for (int i = 0; i < main.size(); i++) {
        saveFile(main.get(i), productEntity, ImageType.MAIN, i + 1);
      }
    }

    if (details != null) {
      for (int i = 0; i < details.size(); i++) {
        saveFile(details.get(i), productEntity, ImageType.DETAIL, i + 1);
      }
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

    productRepository.save(productEntity);
    if (thumbnail != null && !thumbnail.isEmpty()) {
      saveFile(thumbnail, productEntity, ImageType.THUMBNAIL, 1);
    }

    if (main != null) {
      for (int i = 0; i < main.size(); i++) {
        saveFile(main.get(i), productEntity, ImageType.MAIN, i + 1);
      }
    }

    if (details != null) {
      for (int i = 0; i < details.size(); i++) {
        saveFile(details.get(i), productEntity, ImageType.DETAIL, i + 1);
      }
    }
  }

  @Override
  public void deleteProduct(Long productId) {
    deleteAllImages(productId);
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

    ProductFileEntity fileEntity = productFileRepository.findById(productFileId)
        .orElseThrow(() -> new IllegalArgumentException("이미지가 존재하지 않습니다."));

    File file = new File(
        itemPath.replace("file:///", ""),
            fileEntity.getNewFileName());

    if (file.exists()) {
      file.delete();
    }

    productFileRepository.delete(fileEntity);
  }

  @Override
  public void deleteAllImages(Long productId) {

    ProductEntity productEntity = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    List<ProductFileEntity> fileList = productFileRepository.findByProductEntity(productEntity);

    for (ProductFileEntity fileEntity : fileList) {

      File file = new File(
          itemPath.replace("file:///", ""),
              fileEntity.getNewFileName());

      if (file.exists()) {
        file.delete();
      }
    }

    productFileRepository.deleteByProductEntity(productEntity);
  }

  private void saveFile(
      MultipartFile file,
      ProductEntity product,
      ImageType imageType,
      int sortOrder) {

    if (file == null || file.isEmpty()) {
      return;
    }
    try {
      String oldFileName = file.getOriginalFilename();

      String newFileName = java.util.UUID.randomUUID() + "_" + oldFileName;

      String savePath = itemPath.replace("file:///", "");

      File dir = new File(savePath);

      if (!dir.exists()) {
        dir.mkdirs();
      }

      file.transferTo(new File(dir, newFileName));

      ProductFileEntity fileEntity = ProductFileEntity.builder()
          .oldFileName(oldFileName)
          .newFileName(newFileName)
          .imageType(imageType)
          .sortOrder(sortOrder)
          .productEntity(product)
          .build();

      productFileRepository.save(fileEntity);
    } catch (IOException e) {
      throw new RuntimeException("파일 저장 실패", e);
    }
  }
}
