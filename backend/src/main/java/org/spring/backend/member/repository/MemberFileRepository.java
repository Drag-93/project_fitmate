package org.spring.backend.member.repository;

import org.spring.backend.member.entity.MemberFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberFileRepository extends JpaRepository<MemberFileEntity, Long> {
    Optional<MemberFileEntity> findByMemberEntityId(Long id);
}
