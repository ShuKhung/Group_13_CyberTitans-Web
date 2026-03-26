package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.dto.LoginDTO;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.security.JwtUtil; // <--- Import máy tạo Token
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil; // <--- Tiêm máy tạo Token vào đây

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        // 1. Tìm user theo username
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 2. KIỂM TRA MẬT KHẨU
            if (loginRequest.getPassword() == null ||
                    loginRequest.getPassword().isEmpty() ||
                    !user.getPasswordHash().equals(loginRequest.getPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai mật khẩu!");
            }

            // 3. TẠO TOKEN (CHÌA KHÓA VÀNG)
            String token = jwtUtil.generateToken(user.getUsername());
            System.out.println("[SERVER] Đã tạo Token cho: " + user.getUsername());

            // 4. TRẢ VỀ DỮ LIỆU KÈM THEO TOKEN
            Map<String, Object> response = new HashMap<>();
            response.put("token", token); // <--- BỎ TOKEN VÀO ĐÂY
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("role", user.getRoleEntity() != null ? user.getRoleEntity().getName() : "MEMBER");
            response.put("coin", user.getCoin());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại!");
        }
    }
}