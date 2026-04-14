package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Service;
import com.Se2.CyberWebApp.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ServiceApiController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/services")
    public List<Service> getAllServices() {
        return serviceRepository.findAllByOrderByIdAsc();
    }
}
