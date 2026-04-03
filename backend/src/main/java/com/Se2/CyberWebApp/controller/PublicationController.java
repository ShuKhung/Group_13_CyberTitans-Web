package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Publication;
import com.Se2.CyberWebApp.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publications")
public class PublicationController {

    @Autowired
    private PublicationRepository publicationRepository;

    @GetMapping
    public ResponseEntity<List<Publication>> getAllPublications() {
        return ResponseEntity.ok(publicationRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publication> getPublicationById(@PathVariable Integer id) {
        return publicationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPublication(@RequestBody Publication publication) {
        if (publication.getCreatedAt() == null) {
            publication.setCreatedAt(LocalDate.now());
        }
        Publication saved = publicationRepository.save(publication);
        return ResponseEntity.ok(Map.of("message", "Publication created successfully", "data", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePublication(@PathVariable Integer id, @RequestBody Publication updatedPub) {
        return publicationRepository.findById(id).map(pub -> {
            pub.setTitle(updatedPub.getTitle());
            pub.setOriginalAuthor(updatedPub.getOriginalAuthor());
            pub.setCategory(updatedPub.getCategory());
            pub.setAbstractText(updatedPub.getAbstractText());
            pub.setPublicationUrl(updatedPub.getPublicationUrl());
            if (updatedPub.getCreatedAt() != null) {
                pub.setCreatedAt(updatedPub.getCreatedAt());
            }
            publicationRepository.save(pub);
            return ResponseEntity.ok(Map.of("message", "Publication updated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePublication(@PathVariable Integer id) {
        return publicationRepository.findById(id).map(pub -> {
            publicationRepository.delete(pub);
            return ResponseEntity.ok(Map.of("message", "Publication deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}