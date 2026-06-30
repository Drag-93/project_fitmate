package org.spring.backend.member.repository;

import org.spring.backend.member.entity.RefreshEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {
}
