package org.spring.backend.store.product.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.product.dto.ProductDto;
import org.spring.backend.store.product.service.ProductService;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService{

  @Override
  public void insertProduct(ProductDto productDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertProduct'");
  }

  @Override
  public void updateProduct(Long productId, ProductDto productDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateProduct'");
  }

  @Override
  public void deleteProduct(Long productId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteProduct'");
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
