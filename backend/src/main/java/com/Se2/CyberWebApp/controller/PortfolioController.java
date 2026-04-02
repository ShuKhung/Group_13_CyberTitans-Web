package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.entity.UserExperience;
import com.Se2.CyberWebApp.entity.Education;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.UserExperienceRepository;
import com.Se2.CyberWebApp.repository.EducationRepository;
import com.Se2.CyberWebApp.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Controller
public class PortfolioController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserExperienceRepository experienceRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/portfolio/me")
    public String myPortfolio(HttpServletRequest request, Model model) {
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("cyber_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return "redirect:/login";
        }

        try {
            String username = jwtUtil.extractUsername(token);
            if (username == null || !jwtUtil.validateToken(token, username)) {
                return "redirect:/login";
            }
            return getUserPortfolio(username, model);
        } catch (Exception e) {
            return "redirect:/login";
        }
    }

    @GetMapping("/portfolio/{username}")
    public String publicPortfolio(@PathVariable String username, Model model) {
        return getUserPortfolio(username, model);
    }

    private String getUserPortfolio(String username, Model model) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return "pages/404"; // Or a proper error page
        }

        User user = userOpt.get();
        List<UserExperience> experiences = experienceRepository.findByUserIdOrderByStartDateDesc(user.getId());
        List<Education> educations = educationRepository.findByUserIdOrderByStartYearDesc(user.getId());

        // Calculate Stats
        long deployments = experiences.stream()
                .filter(e -> e.getType() != null && e.getType().equalsIgnoreCase("PROJECT"))
                .count();
        
        long training = experiences.stream()
                .filter(e -> e.getType() != null && e.getType().equalsIgnoreCase("TRAINING"))
                .count();

        // Rank Calculation
        long rank = userRepository.countByPointGreaterThan(user.getPoint()) + 1;
        model.addAttribute("rank", rank);

        if (user.getPoint() == null) {
             model.addAttribute("reputation", "0");
        } else {
             model.addAttribute("reputation", String.format("%,.0f", user.getPoint()));
        }

        model.addAttribute("user", user);
        model.addAttribute("experiences", experiences);
        model.addAttribute("educations", educations);
        model.addAttribute("deployments", deployments);
        model.addAttribute("training", training);

        return "pages/portfolio";
    }
}
