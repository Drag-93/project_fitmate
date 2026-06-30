package org.spring.backend.payment.repository;

import org.spring.backend.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity,Long>{
  
}
