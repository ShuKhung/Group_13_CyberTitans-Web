package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.Project;
import com.Se2.CyberWebApp.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Controller
public class WebController {

    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    @Autowired
    private ProjectService projectService;

    @GetMapping("/")
    public String index() {
        return "pages/home";
    }

    @GetMapping("/home")
    public String home() {
        return "pages/home";
    }

    @GetMapping("/admin")
    public String admin() {
        return "pages/admin";
    }

    @GetMapping("/faq")
    public String faq() {
        return "pages/faq";
    }

    @GetMapping("/permissions")
    public String permissions() {
        return "pages/permissions";
    }

    @GetMapping("/profile")
    public String profile() {
        return "pages/profile";
    }

    @GetMapping("/projects")
    public String projects(@RequestParam(required = false) String keyword, Model model) {
        logger.debug("[CONTROLLER] Accessing /projects with keyword: {}", keyword);
        
        List<Project> projects = projectService.searchProjects(keyword);
        List<String> techStack = projectService.getUniqueTechStack();
        Map<String, Long> categoryCounts = projectService.getCategoryCounts();
        
        logger.debug("[CONTROLLER] Projects found: {}", projects.size());
        logger.debug("[CONTROLLER] Tech stack size: {}", techStack.size());
        logger.debug("[CONTROLLER] Category counts size: {}", categoryCounts.size());
        
        model.addAttribute("projects", projects);
        model.addAttribute("techStack", techStack);
        model.addAttribute("categoryCounts", categoryCounts);
        model.addAttribute("searchKeyword", keyword);
        return "pages/projects";
    }

    @GetMapping("/publications")
    public String publications() {
        return "pages/publications";
    }

    @GetMapping("/ranking")
    public String ranking() {
        return "pages/ranking";
    }


    @GetMapping("/team")
    public String team() {
        return "pages/team";
    }

}
