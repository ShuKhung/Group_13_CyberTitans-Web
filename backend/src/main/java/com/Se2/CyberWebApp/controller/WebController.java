package com.Se2.CyberWebApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

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
    public String projects() {
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
