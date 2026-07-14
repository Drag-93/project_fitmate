package org.spring.backend.admin.repository;

import org.spring.backend.admin.entity.PersonalScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalScheduleRepository extends JpaRepository<PersonalScheduleEntity, Integer> {
}
