package org.spring.backend.store.cart.controller;

import java.util.List;

import org.spring.backend.store.cart.dto.CartDto;
import org.spring.backend.store.cart.dto.CartListDto;
import org.spring.backend.store.cart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
  private final CartService cartService;

  // 장바구니 추가
  @PostMapping
  public ResponseEntity<Void> addCart(
      @RequestParam Long memberId,
      @RequestBody CartListDto cartListDto) {

    cartService.insertCart(memberId, cartListDto);
    return ResponseEntity.ok().build();
  }


  // 내 장바구니 조회
  @GetMapping("/{memberId}")
  public ResponseEntity<List<CartListDto>> cartList(@PathVariable Long memberId) {
    return ResponseEntity.ok(cartService.cartList(memberId));
  }


  // 수량 수정
  @PutMapping("/{cartItemId}")
  public ResponseEntity<Void> updateQuantity(
      @PathVariable Long cartItemId,
      @RequestBody CartListDto cartListDto) {

    cartService.updateQuantity(cartItemId, cartListDto);
    return ResponseEntity.ok().build();
  }


  // 장바구니 삭제 (단건)
  @DeleteMapping("/{cartItemId}")
  public ResponseEntity<Void> deleteCart(@PathVariable Long cartItemId) {
    cartService.deleteCartItem(cartItemId);
    return ResponseEntity.ok().build();
  }

  // 장바구니 전체 삭제
  @DeleteMapping("/clear/{memberId}")
  public ResponseEntity<Void> clearCart(@PathVariable Long memberId) {
    cartService.clearCart(memberId);
    return ResponseEntity.ok().build();
  }
}
