package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.service.ProjectService;
import com.Se2.CyberWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername() != null ? user.getUsername() : "N/A");
            map.put("name", user.getName() != null ? user.getName() : "N/A");
            map.put("email", user.getEmail() != null ? user.getEmail() : "N/A");
            map.put("role", user.getRoleEntity() != null ? user.getRoleEntity().getName() : "ROLE_USER");
            map.put("coin", user.getCoin() != null ? user.getCoin() : 0);
            map.put("enabled", user.isEnabled());
            map.put("point", user.getPoint() != null ? user.getPoint() : 0.0);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Integer id) {
        try {
            userService.banUser(id);
            return ResponseEntity.ok(Map.of("message", "Operative terminated. Access revoked."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Integer id) {
        try {
            userService.unbanUser(id);
            return ResponseEntity.ok(Map.of("message", "Operative restored. Access granted."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required."));
        }
        try {
            userService.updatePassword(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Security override initiated. Password updated."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/economy")
    public ResponseEntity<?> adjustEconomy(@PathVariable Integer id, @RequestBody Map<String, Integer> request) {
        Integer amount = request.get("amount");
        if (amount == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Amount is required."));
        }
        try {
            userService.adjustCoins(id, amount);
            return ResponseEntity.ok(Map.of("message", "Financial assets adjusted."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    // --- Project Management ---

    /** Fetch all projects currently in PENDING state (status = 2). */
    @GetMapping("/projects/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingProjects() {
        List<Project> pending = projectService.getPendingProjects();
        List<Map<String, Object>> response = pending.stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("slug", p.getSlug());
            map.put("techStack", p.getTechnologies());
            map.put("teamId", p.getTeamId());
            map.put("githubUrl", p.getGithubUrl());
            map.put("submittedAt", p.getCreatedAt()); 
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/projects/{id}/approve")
    public ResponseEntity<?> approveProject(@PathVariable Integer id) {
        projectService.updateProjectStatus(id, (short) 1);
        return ResponseEntity.ok(Map.of("message", "Project approved. It is now live on the public terminal."));
    }

    @PostMapping("/projects/{id}/reject")
    public ResponseEntity<?> rejectProject(@PathVariable Integer id) {
        projectService.updateProjectStatus(id, (short) 0);
        return ResponseEntity.ok(Map.of("message", "Project rejected. Archiving records."));
    }

    /** Fetch all active projects (status = 1) for management. */
    @GetMapping("/projects/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveProjects() {
        List<Project> active = projectService.getActiveProjects();
        List<Map<String, Object>> response = active.stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("slug", p.getSlug());
            map.put("techStack", p.getTechnologies());
            map.put("teamId", p.getTeamId());
            map.put("githubUrl", p.getGithubUrl());
            map.put("views", p.getViews());
            map.put("ratingAvg", p.getRatingAvg());
            map.put("publishedAt", p.getPublishedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /** Admin requests deletion of a project (sets status = 3 PENDING_DELETE). */
    @PostMapping("/projects/{id}/request-delete")
    public ResponseEntity<?> requestDeleteProject(@PathVariable Integer id) {
        projectService.updateProjectStatus(id, (short) 3);
        return ResponseEntity.ok(Map.of("message", "Deletion request submitted. Awaiting Super Admin authorization."));
    }
}
