package org.spring.backend.store.payment.repository;

import java.util.List;

import org.spring.backend.store.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

  // 마이페이지
  @EntityGraph(attributePaths = {"orderEntity"})
  List<PaymentEntity> findByOrderEntity_MemberEntity_Id(Long memberId);

  // 관리자용 전체 조회
  @EntityGraph(attributePaths = {"orderEntity"})
  List<PaymentEntity> findAllWithOrder();
  

}
