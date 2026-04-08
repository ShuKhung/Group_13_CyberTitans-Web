package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.CategoryRepository;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.security.JwtUtil;
import com.Se2.CyberWebApp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = "*")
public class ProjectApiController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ─── PUBLIC: Get all approved projects (JSON) ───────────────────
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getApprovedProjects() {
        List<Project> projects = projectService.searchProjects(null);

        List<Map<String, Object>> response = projects.stream().map(p -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("slug", p.getSlug());
            map.put("description", p.getDescription());
            map.put("image", p.getImage());
            map.put("technologies", p.getTechnologies());
            map.put("techStack", p.getTechnologies() != null
                    ? Arrays.asList(p.getTechnologies().split(",\\s*"))
                    : List.of());
            map.put("githubUrl", p.getGithubUrl());
            map.put("demoUrl", p.getDemoUrl());
            map.put("ratingAvg", p.getRatingAvg());
            map.put("ratingCount", p.getRatingCount());
            map.put("views", p.getViews());
            map.put("teamId", p.getTeamId());
            map.put("status", getStatusLabel(p.getStatus()));
            map.put("category", p.getCategory() != null ? p.getCategory().getName() : null);
            map.put("publishedAt", p.getPublishedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ─── PUBLIC: Get single project detail ──────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Integer id) {
        Optional<Project> opt = projectService.getProjectById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Project not found."));
        }

        Project p = opt.get();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", p.getId());
        map.put("name", p.getName());
        map.put("slug", p.getSlug());
        map.put("description", p.getDescription());
        map.put("image", p.getImage());
        map.put("technologies", p.getTechnologies());
        map.put("techStack", p.getTechnologies() != null
                ? Arrays.asList(p.getTechnologies().split(",\\s*"))
                : List.of());
        map.put("githubUrl", p.getGithubUrl());
        map.put("demoUrl", p.getDemoUrl());
        map.put("ratingAvg", p.getRatingAvg());
        map.put("ratingCount", p.getRatingCount());
        map.put("views", p.getViews());
        map.put("teamId", p.getTeamId());
        map.put("status", getStatusLabel(p.getStatus()));
        map.put("category", p.getCategory() != null ? p.getCategory().getName() : null);
        map.put("publishedAt", p.getPublishedAt());
        map.put("members", List.of()); // placeholder for future member data
        map.put("totalTasks", 0);
        map.put("completedTasks", 0);

        return ResponseEntity.ok(map);
    }

    // ─── AUTHENTICATED: Submit a new project request (status=PENDING) ──
    @PostMapping("/submit")
    public ResponseEntity<?> submitProject(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));

        String name = (String) request.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Project name is required."));
        }

        Project project = new Project();
        project.setName(name);
        project.setSlug(generateSlug(name));
        project.setDescription((String) request.get("description"));
        project.setImage((String) request.get("image"));
        project.setGithubUrl((String) request.get("githubUrl"));
        project.setDemoUrl((String) request.get("demoUrl"));
        project.setTeamId((String) request.get("teamId"));
        project.setStatus((short) 2); // PENDING

        // Handle technologies — accept both String and List<String>
        Object techObj = request.get("technologies");
        if (techObj == null) techObj = request.get("techStack");
        if (techObj instanceof List) {
            project.setTechnologies(String.join(", ", (List<String>) techObj));
        } else if (techObj instanceof String) {
            project.setTechnologies((String) techObj);
        }

        // Attach category if provided
        Object catIdObj = request.get("categoryId");
        if (catIdObj != null) {
            try {
                Integer catId = Integer.parseInt(catIdObj.toString());
                categoryRepository.findById(catId).ifPresent(project::setCategory);
            } catch (NumberFormatException ignored) {}
        }

        project.setUser(user);
        Project saved = projectService.saveProject(project);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "message", "Project submitted successfully. Awaiting admin approval.",
                "status", "PENDING"
        ));
    }

    // ─── AUTHENTICATED: Submit project via POST /api/v1/projects ──────
    @PostMapping
    public ResponseEntity<?> createProject(
            @RequestBody Map<String, Object> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // Delegate to submit endpoint logic
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required to create a project."));
        }
        return submitProject(request, authHeader);
    }

    // ─── AUTHENTICATED: Get my own submissions ──────────────────────
    @GetMapping("/my-submissions")
    public ResponseEntity<?> getMySubmissions(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));

        List<Project> myProjects = projectService.getProjectsByUser(user);

        List<Map<String, Object>> response = myProjects.stream().map(p -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("status", p.getStatus());
            map.put("statusLabel", getStatusLabel(p.getStatus()));
            map.put("technologies", p.getTechnologies());
            map.put("teamId", p.getTeamId());
            map.put("submittedAt", p.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ─── Helpers ─────────────────────────────────────────────────────
    private String generateSlug(String name) {
        if (name == null) return "untitled";
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String getStatusLabel(Short status) {
        if (status == null) return "UNKNOWN";
        return switch (status) {
            case 0 -> "REJECTED";
            case 1 -> "APPROVED";
            case 2 -> "PENDING";
            default -> "UNKNOWN";
        };
    }
}
