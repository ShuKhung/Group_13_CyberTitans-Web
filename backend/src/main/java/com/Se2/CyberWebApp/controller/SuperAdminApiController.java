package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/super-admin")
@CrossOrigin(origins = "*")
public class SuperAdminApiController {

    @Autowired
    private UserService userService;

    @PostMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String roleName = request.get("roleName");
        if (roleName == null || roleName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role name is required."));
        }
        // Use the role name exactly as provided — matches DB values: MENTEE, MENTOR, ADMIN, SUPER ADMIN
        userService.updateUserRole(id, roleName);
        return ResponseEntity.ok(Map.of("message", "Role updated. Identity matrix recalibrated."));
    }

    @GetMapping("/system-logs")
    public ResponseEntity<?> getSystemLogs() {
        // Placeholder for real logs
        return ResponseEntity.ok(Map.of("logs", "SYSTEM_ACCESS: ADMIN_LOGIN(AdminOperative)\nUSER_MODIFIED: ROLE_UPDATE(UserX -> ROLE_ADMIN)\nSECURITY_SCAN_COMPLETED\nDATABASE_INTEGRITY_VERIFIED"));
    }
}
