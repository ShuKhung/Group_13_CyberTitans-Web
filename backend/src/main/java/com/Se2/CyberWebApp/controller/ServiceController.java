package com.Se2.CyberWebApp.controller;

import org.springframework.ui.Model;
import com.Se2.CyberWebApp.entity.Service;
import com.Se2.CyberWebApp.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/services")
    public String viewServices(Model model) {
        List<Service> list = serviceRepository.findAll();

        model.addAttribute("services", list);

        return "pages/services";
    }
}