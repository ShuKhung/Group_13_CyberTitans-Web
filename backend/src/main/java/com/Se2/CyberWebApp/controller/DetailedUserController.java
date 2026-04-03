package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.entity.UserExperience;
import com.Se2.CyberWebApp.entity.Education;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.UserExperienceRepository;
import com.Se2.CyberWebApp.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/detailed-users")
@CrossOrigin(origins = "*")
public class DetailedUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserExperienceRepository experienceRepository;

    @Autowired
    private EducationRepository educationRepository;

    @GetMapping("/all")
    public ResponseEntity<?> getAllDetailedUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
             Map<String, Object> map = new HashMap<>();
             map.put("id", user.getId());
             map.put("name", user.getName());
             map.put("avatar", user.getAvatar());
             map.put("role", (user.getRoleEntity() != null) ? user.getRoleEntity().getName() : "MEMBER");
             map.put("phone", user.getPhone() != null ? user.getPhone() : "CLASSIFIED");
             map.put("address", user.getAddress() != null ? user.getAddress() : "UNKNOWN LOCATION");
             map.put("email", user.getEmail() != null ? user.getEmail() : "ENCRYPTED");
             map.put("coin", user.getCoin() != null ? user.getCoin() : 0);

             List<UserExperience> experiences = experienceRepository.findByUserIdOrderByStartDateDesc(user.getId());
             map.put("experiences", experiences);

             List<Education> educations = educationRepository.findByUserIdOrderByStartYearDesc(user.getId());
             map.put("educations", educations);

             String description = null;
             String facebook = null;
             String linkedin = null;
             
             if (experiences != null && !experiences.isEmpty()) {
                 UserExperience exp = experiences.get(0);
                 description = exp.getDescription();
                 
                 if (exp.getReferenceInfo() != null && exp.getReferenceInfo().contains("|")) {
                     String[] socials = exp.getReferenceInfo().split("\\|");
                     facebook = socials[0].equals("null") ? null : socials[0];
                     if (socials.length > 1) {
                        linkedin = socials[1].equals("null") ? null : socials[1];
                     }
                 }
             }

             StringBuilder fabricatedDesc = new StringBuilder();
             if (description != null) {
                 fabricatedDesc.append(description);
             } else {
                 fabricatedDesc.append("\n> system_status: Active Member.");
                 fabricatedDesc.append("\n> focus_area: Classified.");
             }
             
             int salt = user.getId() != null ? user.getId() : 0;
             fabricatedDesc.append("\n> achievements: ");
             fabricatedDesc.append("\n  - Completed " + (salt % 5 + 3) + " Advanced Cyber Missions.");
             fabricatedDesc.append("\n  - Top " + (salt % 10 + 1) + "% in Global CyberTitans Hackathon.");
             fabricatedDesc.append("\n  - Secured " + (salt % 20 + 10) + " critical vulnerabilities.");
             
             fabricatedDesc.append("\n> projects: ");
             fabricatedDesc.append("\n  - Operation Alpha (Lead Architect).");
             fabricatedDesc.append("\n  - Project Sentinel (Core Contributor).");
             
             fabricatedDesc.append("\n> skills: Java, Spring Boot, React, Penetration Testing, SQL.");
             fabricatedDesc.append("\n> clearance_level: Level " + (salt % 5 + 1) + " Operative.");

             map.put("description", fabricatedDesc.toString());
             if (facebook != null) map.put("facebook", facebook);
             if (linkedin != null) map.put("linkedin", linkedin);

             result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
