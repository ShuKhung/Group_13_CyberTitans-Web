package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.ClubEvent;
import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.repository.ClubEventRepository;
import com.Se2.CyberWebApp.entity.Announcement;
import com.Se2.CyberWebApp.repository.AnnouncementRepository;
import com.Se2.CyberWebApp.service.ProjectService;
import com.Se2.CyberWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/super-admin")
@CrossOrigin(origins = "*")
public class SuperAdminApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private ClubEventRepository clubEventRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String roleName = request.get("roleName");
        if (roleName == null || roleName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role name is required."));
        }
        userService.updateUserRole(id, roleName);
        return ResponseEntity.ok(Map.of("message", "Role updated. Identity matrix recalibrated."));
    }

    @GetMapping("/system-logs")
    public ResponseEntity<?> getSystemLogs() {
        return ResponseEntity.ok(Map.of("logs", "SYSTEM_ACCESS: ADMIN_LOGIN(AdminOperative)\nUSER_MODIFIED: ROLE_UPDATE(UserX -> ROLE_ADMIN)\nSECURITY_SCAN_COMPLETED\nDATABASE_INTEGRITY_VERIFIED"));
    }

    // --- EVENT CRUD ---

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody ClubEvent event) {
        if (event.getTitle() == null || event.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event title is required."));
        }
        clubEventRepository.save(event);

        // Auto-generate notification
        Announcement notif = new Announcement(
                "New Event: " + event.getTitle(),
                "A new event has been scheduled. Check it out and register!",
                "EVENT"
        );
        announcementRepository.save(notif);

        return ResponseEntity.ok(Map.of("message", "Event created successfully.", "event", event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Integer id, @RequestBody ClubEvent eventDetails) {
        return clubEventRepository.findById(id).map(existingEvent -> {
            existingEvent.setTitle(eventDetails.getTitle());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setEventDate(eventDetails.getEventDate());
            existingEvent.setLocation(eventDetails.getLocation());
            existingEvent.setCapacity(eventDetails.getCapacity());
            existingEvent.setEventType(eventDetails.getEventType());
            existingEvent.setCoins(eventDetails.getCoins());
            clubEventRepository.save(existingEvent);
            return ResponseEntity.ok(Map.of("message", "Event updated successfully.", "event", existingEvent));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Integer id) {
        if (!clubEventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clubEventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully."));
    }

    // --- PROJECT DELETION MANAGEMENT (Super Admin Only) ---

    /** Fetch all projects with PENDING_DELETE status (status = 3). */
    @GetMapping("/projects/pending-delete")
    public ResponseEntity<List<Map<String, Object>>> getPendingDeleteProjects() {
        List<Project> pendingDelete = projectService.getPendingDeleteProjects();
        List<Map<String, Object>> response = pendingDelete.stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("slug", p.getSlug());
            map.put("techStack", p.getTechnologies());
            map.put("teamId", p.getTeamId());
            map.put("githubUrl", p.getGithubUrl());
            map.put("views", p.getViews());
            map.put("ratingAvg", p.getRatingAvg());
            map.put("requestedAt", p.getUpdatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /** Super Admin confirms deletion — permanently removes the project. */
    @PostMapping("/projects/{id}/confirm-delete")
    public ResponseEntity<?> confirmDeleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("message", "Project permanently deleted. All records purged."));
    }

    /** Super Admin cancels deletion — reverts project back to active (status = 1). */
    @PostMapping("/projects/{id}/cancel-delete")
    public ResponseEntity<?> cancelDeleteProject(@PathVariable Integer id) {
        projectService.updateProjectStatus(id, (short) 1);
        return ResponseEntity.ok(Map.of("message", "Deletion request cancelled. Project restored to active status."));
    }
}
