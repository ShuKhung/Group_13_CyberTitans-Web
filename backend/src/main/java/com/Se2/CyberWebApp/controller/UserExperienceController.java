package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.entity.UserExperience;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.UserExperienceRepository;
import com.Se2.CyberWebApp.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/experience")
@CrossOrigin(origins = "*")
public class UserExperienceController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserExperienceController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserExperienceRepository experienceRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserIdFromToken(HttpServletRequest request) {
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
        
        // Fallback to Header if cookie missing
        if (token == null) {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                token = header.substring(7);
            }
        }

        if (token != null) {
            try {
                String username = jwtUtil.extractUsername(token);
                if (username != null && jwtUtil.validateToken(token, username)) {
                    Optional<User> user = userRepository.findByUsername(username);
                    return user.map(User::getId).orElse(null);
                }
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyExperiences(HttpServletRequest request) {
        logger.info("[REQUEST] GET /api/v1/experience/me");
        Integer userId = getUserIdFromToken(request);
        if (userId == null) {
            logger.warn("[AUTH] Unauthorized access attempt to /me");
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        logger.info("[DB] Fetching experiences for user ID: {}", userId);
        try {
            List<UserExperience> experiences = experienceRepository.findByUserIdOrderByStartDateDesc(userId);
            logger.info("[SUCCESS] Found {} experiences", experiences.size());
            return ResponseEntity.ok(experiences);
        } catch (Exception e) {
            logger.error("[ERROR] Failed to fetch or serialize experiences: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addExperience(@RequestBody UserExperience exp, HttpServletRequest request) {
        Integer userId = getUserIdFromToken(request);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        exp.setUserId(userId);
        exp.setStatus((short) 1);
        UserExperience saved = experienceRepository.save(exp);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperience(@PathVariable Integer id, @RequestBody UserExperience updatedExp, HttpServletRequest request) {
        Integer userId = getUserIdFromToken(request);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Optional<UserExperience> existingOpt = experienceRepository.findById(id);
        if (existingOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Experience not found"));

        UserExperience existing = existingOpt.get();
        if (!existing.getUserId().equals(userId)) return ResponseEntity.status(403).body(Map.of("message", "Permisson denied"));

        // Update fields
        existing.setOrganizationName(updatedExp.getOrganizationName());
        existing.setPositionTitle(updatedExp.getPositionTitle());
        existing.setStartDate(updatedExp.getStartDate());
        existing.setEndDate(updatedExp.getEndDate());
        existing.setType(updatedExp.getType());
        existing.setTags(updatedExp.getTags());
        existing.setDescription(updatedExp.getDescription());

        UserExperience saved = experienceRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = getUserIdFromToken(request);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Optional<UserExperience> existingOpt = experienceRepository.findById(id);
        if (existingOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Experience not found"));

        UserExperience existing = existingOpt.get();
        if (!existing.getUserId().equals(userId)) return ResponseEntity.status(403).body(Map.of("message", "Permisson denied"));

        experienceRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Record deleted"));
    }
}
