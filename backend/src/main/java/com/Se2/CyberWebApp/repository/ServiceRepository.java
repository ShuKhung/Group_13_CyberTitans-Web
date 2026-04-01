package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
}
