package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Announcement;
import com.Se2.CyberWebApp.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements(@RequestParam(required = false) String type) {
        if (type != null && !type.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(announcementRepository.findByTypeOrderByCreatedAtDesc(type.toUpperCase()));
        }
        return ResponseEntity.ok(announcementRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        if (announcement.getType() == null || announcement.getType().isBlank()) {
            announcement.setType("INFO"); 
        } else {
            announcement.setType(announcement.getType().toUpperCase());
        }
        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(Map.of("message", "Announcement created successfully.", "announcement", saved));
    }

    @Transactional
    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead() {
        announcementRepository.markAllAsRead();
        return ResponseEntity.ok(Map.of("message", "All announcements marked as read."));
    }

    @Transactional
    @PutMapping("/{id}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        announcementRepository.markAsReadById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement marked as read."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Integer id) {
        if(!announcementRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted successfully."));
    }
}
