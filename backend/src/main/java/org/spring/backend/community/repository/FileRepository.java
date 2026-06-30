package org.spring.backend.community.repository;

import org.spring.backend.community.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, Long>{
}
