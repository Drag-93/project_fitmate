package org.spring.backend.store.cart.service.serviceImpl;

import java.util.List;

import org.spring.backend.store.cart.dto.CartDto;
import org.spring.backend.store.cart.service.CartService;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService{

  @Override
  public void insertCart(Long memberId, CartDto cartDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'insertCart'");
  }

  @Override
  public List<CartDto> cartList(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'cartList'");
  }

  @Override
  public int countCartItems(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'countCartItems'");
  }

  @Override
  public void updateQuantity(Long cartItemId, CartDto cartDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'updateQuantity'");
  }

  @Override
  public void deleteCartItem(Long cartItemId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteCartItem'");
  }

  @Override
  public void clearCart(Long memberId) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'clearCart'");
  }
  
}
