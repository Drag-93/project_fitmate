package org.spring.backend.store.payment.repository;

import org.spring.backend.store.payment.entity.PaymentResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentResultRepository extends JpaRepository<PaymentResultEntity,Long>{
  
}
