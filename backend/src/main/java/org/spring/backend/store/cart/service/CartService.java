package org.spring.backend.store.cart.service;

import java.util.List;

import org.spring.backend.store.cart.dto.CartDto;


public interface CartService {

  void insertCart(Long memberId, CartDto cartDto);

  List<CartDto> cartList(Long memberId);

  int countCartItems(Long memberId);

  void updateQuantity(Long cartItemId, CartDto cartDto);

  void deleteCartItem(Long cartItemId);

  void clearCart(Long memberId);
}
