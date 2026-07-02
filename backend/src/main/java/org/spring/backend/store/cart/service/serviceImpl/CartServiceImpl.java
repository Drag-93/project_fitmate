package org.spring.backend.store.cart.service.serviceImpl;

import java.util.List;

import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.cart.dto.CartDto;
import org.spring.backend.store.cart.dto.CartListDto;
import org.spring.backend.store.cart.entity.CartEntity;
import org.spring.backend.store.cart.entity.CartListEntity;
import org.spring.backend.store.cart.repository.CartListRepository;
import org.spring.backend.store.cart.repository.CartRepository;
import org.spring.backend.store.cart.service.CartService;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

  private final CartRepository cartRepository;
  private final CartListRepository cartListRepository;
  private final MemberRepository memberRepository;
  private final ProductRepository productRepository;

  @Override
  public void insertCart(Long memberId, CartListDto cartListDto) {

    MemberEntity memberEntity = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

    ProductEntity productEntity = productRepository.findById(cartListDto.getProductId())
        .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

    // 회원의 장바구니 조회
    CartEntity cartEntity = cartRepository.findByMemberEntityId(memberId)
        .orElseThrow(() -> new IllegalArgumentException("장바구니가 존재하지 않습니다."));

    // 장바구니가 없으면 생성
    if (cartEntity == null) {
        cartEntity = CartEntity.builder()
                .memberEntity(memberEntity)
                .build();

        cartRepository.save(cartEntity);
    }

    // 장바구니 상품 생성
    CartListEntity cartListEntity = CartListEntity.builder()
            .cartEntity(cartEntity)
            .productEntity(productEntity)
            .quantity(cartListDto.getQuantity())
            .build();

    cartListRepository.save(cartListEntity);

  }

  @Override
  @Transactional(readOnly = true)
  public List<CartListDto> cartList(Long memberId) {
    CartEntity cartEntity = cartRepository.findByMemberEntityId(memberId)
        .orElseThrow(() -> new IllegalArgumentException("장바구니가 존재하지 않습니다."));

    return cartEntity.getCartListEntities()
        .stream()
        .map(CartListDto::toCartListDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public int countCartItems(Long memberId) {
    return cartListRepository.countByCartEntityId(memberId);
  }

  @Override
  public void updateQuantity(Long cartItemId, CartListDto cartListDto) {
    CartListEntity cartListEntity = cartListRepository.findById(cartItemId)
        .orElseThrow(() -> new IllegalArgumentException("장바구니가 존재하지 않습니다."));

    cartListEntity.setQuantity(cartListDto.getQuantity());
  }

  @Override
  public void deleteCartItem(Long cartItemId) {
    cartRepository.deleteById(cartItemId);
  }

  @Override
  public void clearCart(Long memberId) {
    cartListRepository.deleteByCartEntityId(memberId);
  }

}
