package org.spring.backend.store;

import java.time.LocalDate;
import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.spring.backend.member.entity.MemberEntity;
import org.spring.backend.member.repository.MemberRepository;
import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.entity.OrderItemEntity;
import org.spring.backend.store.order.repository.OrderItemRepository;
import org.spring.backend.store.order.repository.OrderRepository;
import org.spring.backend.store.order.type.DeliveryStatus;
import org.spring.backend.store.order.type.OrderStatus;
import org.spring.backend.store.product.entity.ProductEntity;
import org.spring.backend.store.product.repository.ProductRepository;
import org.spring.backend.store.product.type.BillingType;
import org.spring.backend.store.product.type.ProductStatus;
import org.spring.backend.store.product.type.ProductType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProductsTest {

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private MemberRepository memberRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private OrderItemRepository orderItemRepository;

  @Test
  void insert() {
    for (int i = 2; i <10; i++) {

      ProductEntity productEntity = ProductEntity.builder()
              .productName("상품" + i)
              .description("상품" + i + "설명입니다.")
              .price(10000 + i)
              .productType(ProductType.GOODS)
              .billingType(BillingType.ONE_TIME)
              .productStatus(ProductStatus.ACTIVE)
              .category("다이어트")
              .build();

      productRepository.save(productEntity);
    }
  }

  @Test
  void insert2() {
    for (int i = 2; i <10; i++) {

      ProductEntity productEntity = ProductEntity.builder()
              .productName("헬스장 이용권" + i)
              .description("헬스장 이용권" + i + "설명입니다.")
              .price(10000 + i)
              .productType(ProductType.GYM)
              .billingType(BillingType.ONE_TIME)
              .productStatus(ProductStatus.ACTIVE)
              .category("헬스장")
              .duration(30)
              .build();

      productRepository.save(productEntity);
    }
  }

  @Test
  void insert3() {
    for (int i = 2; i <10; i++) {

      ProductEntity productEntity = ProductEntity.builder()
              .productName("PT이용권" + i)
              .description("PT이용권" + i + "설명입니다.")
              .price(10000 + i)
              .productType(ProductType.PT)
              .billingType(BillingType.ONE_TIME)
              .productStatus(ProductStatus.ACTIVE)
              .category("PT")
              .sessionCount(20)
              .build();

      productRepository.save(productEntity);
    }
  }

  @Test
  void orderTest() {

    MemberEntity member = memberRepository.findById(1L)
        .orElseThrow();

    ProductEntity product1 = productRepository.findById(1L)
        .orElseThrow();

    ProductEntity product2 = productRepository.findById(2L)
        .orElseThrow();

    ProductEntity product3 = productRepository.findById(3L)
        .orElseThrow();

    // 주문 1
    OrderEntity order1 = OrderEntity.builder()
        .totalPrice(9900)
        .orderStatus(OrderStatus.SUCCESS)
        .deliveryStatus(DeliveryStatus.READY)
        .receiverName("김이박")
        .receiverPhone("010-1111-1111")
        .receiverAddress("서울 강남구")
        .deliveryMemo("문 앞")
        .memberEntity(member)
        .build();
    order1.setOrderItemEntities(new ArrayList<>());
    OrderItemEntity item1 = OrderItemEntity.builder()
        .price(9900)
        .quantity(1)
        .productName("FitMate Plus+ 프리미엄")
        .startDate(LocalDate.now())
        .productEntity(product1)
        .orderEntity(order1)
        .build();

    order1.getOrderItemEntities().add(item1);

    // 주문 2
    OrderEntity order2 = OrderEntity.builder()
        .totalPrice(300000)
        .orderStatus(OrderStatus.SUCCESS)
        .deliveryStatus(DeliveryStatus.SHIPPING)
        .receiverName("홍길동")
        .receiverPhone("010-2222-2222")
        .receiverAddress("서울 마포구")
        .memberEntity(member)
        .build();
    order2.setOrderItemEntities(new ArrayList<>());
    OrderItemEntity item2 = OrderItemEntity.builder()
        .price(300000)
        .quantity(1)
        .productName("PT 10회 이용권")
        .startDate(LocalDate.now())
        .productEntity(product2)
        .orderEntity(order2)
        .build();

    order2.getOrderItemEntities().add(item2);

    // 주문 3
    OrderEntity order3 = OrderEntity.builder()
        .totalPrice(50000)
        .orderStatus(OrderStatus.SUCCESS)
        .deliveryStatus(DeliveryStatus.COMPLETE)
        .receiverName("이영희")
        .receiverPhone("010-3333-3333")
        .receiverAddress("서울 송파구")
        .memberEntity(member)
        .build();
    order3.setOrderItemEntities(new ArrayList<>());
    OrderItemEntity item3 = OrderItemEntity.builder()
        .price(25000)
        .quantity(2)
        .productName("FitMate 운동복")
        .productEntity(product3)
        .orderEntity(order3)
        .build();

    order3.getOrderItemEntities().add(item3);

    orderRepository.save(order1);
    orderRepository.save(order2);
    orderRepository.save(order3);
    orderItemRepository.save(item1);
    orderItemRepository.save(item2);
    orderItemRepository.save(item3);

  }
}
