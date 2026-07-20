package org.spring.backend.admin.repository;

import org.spring.backend.admin.entity.PersonalScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface PersonalScheduleRepository extends JpaRepository<PersonalScheduleEntity, Long> {
    List<PersonalScheduleEntity> findByMemberEntityIdAndEventType(Long memberId,String eventType);
}
