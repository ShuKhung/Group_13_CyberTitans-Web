package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminApiController {

    @Autowired
    private UserService userService;

    /** Returns all users (SUPER ADMIN visible but read-only on the frontend). */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername() != null ? user.getUsername() : "N/A");
            map.put("name", user.getName() != null ? user.getName() : "N/A");
            map.put("email", user.getEmail() != null ? user.getEmail() : "N/A");
            map.put("role", user.getRoleEntity() != null ? user.getRoleEntity().getName() : "ROLE_USER");
            map.put("coin", user.getCoin() != null ? user.getCoin() : 0);
            map.put("enabled", user.isEnabled());
            map.put("point", user.getPoint() != null ? user.getPoint() : 0.0);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Integer id) {
        try {
            userService.banUser(id);
            return ResponseEntity.ok(Map.of("message", "Operative terminated. Access revoked."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Integer id) {
        try {
            userService.unbanUser(id);
            return ResponseEntity.ok(Map.of("message", "Operative restored. Access granted."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required."));
        }
        try {
            userService.updatePassword(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Security override initiated. Password updated."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }

    @PostMapping("/users/{id}/economy")
    public ResponseEntity<?> adjustEconomy(@PathVariable Integer id, @RequestBody Map<String, Integer> request) {
        Integer amount = request.get("amount");
        if (amount == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Amount is required."));
        }
        try {
            userService.adjustCoins(id, amount);
            return ResponseEntity.ok(Map.of("message", "Financial assets adjusted."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }
}

