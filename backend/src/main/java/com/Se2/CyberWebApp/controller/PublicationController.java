package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Publication;
import com.Se2.CyberWebApp.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
public class PublicationController {

    @Autowired
    private PublicationRepository publicationRepository;

    // API lấy toàn bộ danh sách
    @GetMapping
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }
}