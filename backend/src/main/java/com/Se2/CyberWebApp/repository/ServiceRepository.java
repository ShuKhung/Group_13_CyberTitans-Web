package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findAllByOrderByIdAsc();
}
