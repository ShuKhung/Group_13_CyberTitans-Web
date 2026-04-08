package com.Se2.CyberWebApp.controller;

import org.springframework.ui.Model;
import com.Se2.CyberWebApp.entity.Service;
import com.Se2.CyberWebApp.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Controller
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/services")
    public String viewServices(Model model) {
        List<Service> list = serviceRepository.findAllByOrderByIdAsc().stream()
                .filter(s -> !Arrays.asList(1L, 2L, 3L).contains(s.getId()))
                .collect(Collectors.toList());

        model.addAttribute("services", list);

        return "pages/services";
    }
}