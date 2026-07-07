package org.spring.backend.store.order.repository;

import java.util.Arrays;
import java.util.List;

import org.spring.backend.store.order.entity.OrderEntity;
import org.spring.backend.store.order.entity.OrderItemEntity;
import org.spring.backend.store.product.entity.ProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {

    @Query("""
                SELECT oi.productEntity From OrderItemEntity oi
                GROUP BY oi.productEntity
                ORDER BY SUM(oi.quantity) DESC
            """)
    List<ProductEntity> findPopularProducts(Pageable pageable);
    // 1. order_item_tb에서 주문된 상품들을 가져옴
    // 2. product별로 묶음
    // 3. quantity 합산, 많이 팔린 순으로 정렬
    // 4. Pageable로 상위 5개만 가져옴



    @Query("""
            SELECT oi.productEntity FROM OrderItemEntity oi
            WHERE oi.productEntity.category = :category
            GROUP BY oi.productEntity
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<ProductEntity> findPopularProductsByCategory(
            @Param("category") String category,
            Pageable pageable
    );
    // 1. order_item_tb에서 주문된 상품들을 가져옴
    // 2. 그중 ProductEntity.category가 회원 관심사와 매칭된 category인 것만 필터링
    // 3. product별로 묶음
    // 4. quantity 합산, 많이 팔린 순으로 정렬
    // 5. Pageable로 상위 5개만 가져옴
}
