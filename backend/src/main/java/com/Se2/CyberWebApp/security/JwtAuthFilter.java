package com.Se2.CyberWebApp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy chuỗi Authorization từ Header của Request
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // 2. Kiểm tra xem Header có bắt đầu bằng "Bearer " không
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Cắt bỏ 7 ký tự "Bearer " để lấy Token nguyên bản
            username = jwtUtil.extractUsername(token); // Dùng máy JwtUtil để bóc tách lấy Username
        }

        // 3. Nếu tìm thấy Username và Đặc vụ này chưa được xác thực trong phiên làm việc hiện tại
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. Kiểm tra xem Token còn hạn và khớp tên không
            if (jwtUtil.validateToken(token, username)) {

                // Tạo một chứng chỉ xác thực tạm thời cho Spring Security hiểu
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, null // Chỗ này sau này bạn có thể nhét thêm Quyền (Role) vào
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // CHÍNH THỨC CẤP QUYỀN TRUY CẬP CHO REQUEST NÀY
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 5. Cho phép yêu cầu đi tiếp đến Controller
        filterChain.doFilter(request, response);
    }
}