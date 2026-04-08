package com.Se2.CyberWebApp.repository;

import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByNameContainingIgnoreCaseOrTechnologiesContainingIgnoreCase(String name, String technologies);
    Optional<Project> findBySlug(String slug);
    List<Project> findByStatus(Short status);
    
    List<Project> findByStatusAndNameContainingIgnoreCaseOrStatusAndTechnologiesContainingIgnoreCase(Short status1, String name, Short status2, String technologies);

    List<Project> findByUserOrderByCreatedAtDesc(User user);
}
