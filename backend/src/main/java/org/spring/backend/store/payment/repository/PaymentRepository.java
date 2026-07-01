package org.spring.backend.store.payment.repository;

import org.spring.backend.store.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity,Long>{
  
}
