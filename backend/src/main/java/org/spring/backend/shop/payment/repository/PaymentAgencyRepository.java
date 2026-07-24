package org.spring.backend.store.payment.repository;

import org.spring.backend.store.payment.entity.PaymentAgencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentAgencyRepository extends JpaRepository<PaymentAgencyEntity,Long> {
}
