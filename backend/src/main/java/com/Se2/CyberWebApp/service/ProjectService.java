package com.Se2.CyberWebApp.service;

import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.CategoryRepository;
import com.Se2.CyberWebApp.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> searchProjects(String keyword) {
        logger.debug("[SERVICE] Searching approved projects with keyword: {}", keyword);
        // Only return approved projects (status = 1)
        if (keyword == null || keyword.trim().isEmpty()) {
            return projectRepository.findByStatus((short) 1);
        }
        return projectRepository.findByStatusAndNameContainingIgnoreCaseOrStatusAndTechnologiesContainingIgnoreCase(
                (short) 1, keyword, (short) 1, keyword
        );
    }

    public List<Project> getPendingProjects() {
        logger.debug("[SERVICE] Fetching pending projects (status = 2)");
        return projectRepository.findByStatus((short) 2);
    }

    @Transactional
    public void updateProjectStatus(Integer id, Short status) {
        logger.info("[SERVICE] Updating project ID {} to status {}", id, status);
        projectRepository.findById(id).ifPresent(p -> {
            p.setStatus(status);
            projectRepository.save(p);
        });
    }

    public List<String> getUniqueTechStack() {
        logger.debug("[SERVICE] Generating unique tech stack list (Approved only)");
        // Only consider approved projects
        List<Project> allProjects = projectRepository.findByStatus((short) 1);
        if (allProjects == null) return List.of();
        
        return allProjects.stream()
                .map(Project::getTechnologies)
                .filter(Objects::nonNull)
                .flatMap(techs -> Arrays.stream(techs.split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Map<String, Long> getCategoryCounts() {
        logger.debug("[SERVICE] Generating category counts map (Approved only)");
        // Only consider approved projects
        List<Project> allProjects = projectRepository.findByStatus((short) 1);
        if (allProjects == null) return Map.of();

        return allProjects.stream()
                .map(Project::getCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(cat -> {
                    try {
                        return cat.getName();
                    } catch (Exception e) {
                        logger.error("[SERVICE] Error extracting category name from proxy", e);
                        return "Uncategorized";
                    }
                }, Collectors.counting()));
    }

    public Optional<Project> getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug);
    }

    public Optional<Project> getProjectById(Integer id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByUser(User user) {
        return projectRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
}
