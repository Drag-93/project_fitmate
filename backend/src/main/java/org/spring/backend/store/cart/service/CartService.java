package org.spring.backend.store.cart.service;

import java.util.List;

import org.spring.backend.store.cart.dto.CartListDto;


public interface CartService {

  void insertCart(Long memberId, CartListDto carListDto);

  List<CartListDto> cartList(Long memberId);

  int countCartItems(Long memberId);

  void updateQuantity(Long cartItemId, CartListDto carListDto);

  void deleteCartItem(Long cartItemId);

  void clearCart(Long memberId);
}
