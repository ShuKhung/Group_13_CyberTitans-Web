package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.dto.LoginDTO;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.entity.Role;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.RoleRepository;
import com.Se2.CyberWebApp.security.JwtUtil;
import com.Se2.CyberWebApp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // --- REGISTRATION PROTOCOL (WITH OTP) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are strictly required for initialization."));
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Identifier already exists in the system."));
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(password);
        newUser.setCoin(100);
        newUser.setPoint(0.0);

        String generatedOtp = String.format("%06d", new Random().nextInt(999999));
        newUser.setVerificationCode(generatedOtp);
        newUser.setEnabled(false);

        Role defaultRole = roleRepository.findByName("MEMBER")
                .orElseThrow(() -> new RuntimeException("SYSTEM ERROR: Default Role 'MEMBER' not found."));
        newUser.setRoleEntity(defaultRole);

        userRepository.save(newUser);

        try {
            emailService.sendVerificationEmail(newUser.getEmail(), generatedOtp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Operative registered, but email dispatch failed. Contact Admin."));
        }

        return ResponseEntity.ok(Map.of("message", "Registration pending. Verification code dispatched to your comms link."));
    }

    // --- OTP VERIFICATION PROTOCOL ---
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String code = request.get("code");

        return userRepository.findByUsername(username).map(user -> {
            if (code.equals(user.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null); // Clear code after successful verification
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Identity verified. Access granted."));
            }
            return ResponseEntity.status(401).body(Map.of("message", "Invalid security code."));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Operative not found.")));
    }

    // --- LOGIN PROTOCOL ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check if account is verified via OTP
            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Account locked. Please verify your email first."));
            }

            // Check password
            if (loginRequest.getPassword() == null ||
                    loginRequest.getPassword().isEmpty() ||
                    !user.getPasswordHash().equals(loginRequest.getPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Incorrect password."));
            }

            // Create Token
            String token = jwtUtil.generateToken(user);
            System.out.println("[SERVER] Token generated for operative: " + user.getUsername());

            // Return data with token
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("role", user.getRoleEntity() != null ? user.getRoleEntity().getName() : "MEMBER");
            response.put("coin", user.getCoin());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Account does not exist!"));
        }
    }

    // --- CHANGE PASSWORD PROTOCOL ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (username == null || oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request data."));
        }

        return userRepository.findByUsername(username).map(user -> {
            if (!user.getPasswordHash().equals(oldPassword)) {
                return ResponseEntity.status(400).body(Map.of("message", "Incorrect current password."));
            }

            user.setPasswordHash(newPassword);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Security key updated successfully."));

        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Operative profile not found.")));
    }
    // --- RECOVERY PROTOCOL: STEP 1 (REQUEST OTP) ---
    @PostMapping("/forgot-password-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");

        if (username == null || email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and email are required."));
        }

        return userRepository.findByUsername(username).map(user -> {
            // Verify if the provided email matches the one in the database
            if (!user.getEmail().equalsIgnoreCase(email)) {
                return ResponseEntity.status(401).body(Map.of("message", "Identity mismatch. Recovery denied."));
            }

            // Generate new OTP for password reset
            String generatedOtp = String.format("%06d", new Random().nextInt(999999));
            user.setVerificationCode(generatedOtp);
            userRepository.save(user);

            // Dispatch Email
            try {
                emailService.sendVerificationEmail(user.getEmail(), generatedOtp);
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Recovery initiated, but email dispatch failed. Contact Admin."));
            }

            return ResponseEntity.ok(Map.of("message", "Recovery code dispatched to your comms link."));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Operative identifier not found.")));
    }

    // --- RECOVERY PROTOCOL: STEP 2 (RESET PASSWORD) ---
    @PostMapping("/forgot-password-reset")
    public ResponseEntity<?> resetPasswordWithOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (username == null || code == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "All recovery fields are required."));
        }

        return userRepository.findByUsername(username).map(user -> {
            // Verify the OTP code
            if (code.equals(user.getVerificationCode())) {
                user.setPasswordHash(newPassword);
                user.setVerificationCode(null);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of("message", "Security key updated successfully. Access restored."));
            }
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired recovery code."));
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Operative profile not found.")));
    }
}