package org.spring.backend.store.cart.service;

import java.util.List;

import org.spring.backend.store.cart.dto.CartListDto;


public interface CartService {

  void insertCart(String userEmail, CartListDto carListDto);

  List<CartListDto> cartList(String userEmail);

  int countCartItems(String userEmail);

  void updateQuantity(Long cartItemId, CartListDto carListDto);

  void deleteCartItem(Long cartItemId);

  void clearCart(String userEmail);
}
