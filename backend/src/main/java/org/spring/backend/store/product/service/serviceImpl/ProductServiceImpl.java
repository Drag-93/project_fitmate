package org.spring.backend.store.product.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.product.service.ProductService;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;

  @Override
  public void insertProduct(ProductDto productDto) {

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
  public List<ProductDto> productList() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'productList'");
  }

  @Override
  public ProductDto productDetail(Long productId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'productDetail'");
  }

  @Override
  public List<ProductDto> categoryList(String category) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'categoryList'");
  }

  @Override
  public List<ProductDto> searchProduct(String keyword) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'searchProduct'");
  }

}
