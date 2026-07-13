package org.spring.backend.store.MemberProduct.repository;

import org.spring.backend.store.MemberProduct.entity.MemberProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberProductRepository extends JpaRepository<MemberProductEntity,Long>{
  
}
