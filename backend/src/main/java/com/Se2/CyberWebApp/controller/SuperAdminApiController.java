package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.ClubEvent;
import com.Se2.CyberWebApp.repository.ClubEventRepository;
import com.Se2.CyberWebApp.entity.Announcement;
import com.Se2.CyberWebApp.repository.AnnouncementRepository;
import com.Se2.CyberWebApp.entity.Service;
import com.Se2.CyberWebApp.repository.ServiceRepository;
import com.Se2.CyberWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    private ServiceRepository serviceRepository;

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

    // --- SERVICE CRUD ---

    @PostMapping("/services")
    public ResponseEntity<?> createService(@RequestBody Service service) {
        if (service.getTitle() == null || service.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Service title is required."));
        }
        serviceRepository.save(service);
        return ResponseEntity.ok(Map.of("message", "Service created successfully.", "service", service));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        return serviceRepository.findById(id).map(existingService -> {
            existingService.setTitle(serviceDetails.getTitle());
            existingService.setDescription(serviceDetails.getDescription());
            existingService.setContentDetail(serviceDetails.getContentDetail());
            existingService.setIconClass(serviceDetails.getIconClass());
            existingService.setButtonText(serviceDetails.getButtonText());
            existingService.setLinkUrl(serviceDetails.getLinkUrl());
            serviceRepository.save(existingService);
            return ResponseEntity.ok(Map.of("message", "Service updated successfully.", "service", existingService));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Service deleted successfully."));
    }
}
