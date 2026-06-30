package org.spring.backend.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshRepository, Long> {
}
