package org.spring.backend.member.repository;

import org.spring.backend.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    Optional<MemberEntity> findByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);

    Page<MemberEntity> findByUserNameContaining(Pageable pageable, String search);

    Page<MemberEntity> findByUserEmailContaining(Pageable pageable, String search);

}
