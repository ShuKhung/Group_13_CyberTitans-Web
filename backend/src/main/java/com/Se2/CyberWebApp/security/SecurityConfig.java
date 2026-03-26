package com.Se2.CyberWebApp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Thêm thư viện này
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter authFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 1. CẤU HÌNH CORS CHUẨN
                .cors(cors -> cors.configurationSource(request -> {
                    var cache = new org.springframework.web.cors.CorsConfiguration();
                    cache.setAllowedOrigins(java.util.List.of("http://127.0.0.1:5500", "http://localhost:5500"));
                    cache.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cache.setAllowedHeaders(java.util.List.of("*"));
                    cache.setAllowCredentials(true);
                    return cache;
                }))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 🔥 DÒNG QUAN TRỌNG NHẤT ĐỂ FIX LỖI 403 PREFLIGHT:
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. MỞ CỬA CHO LOGIN VÀ DỮ LIỆU CÔNG KHAI
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/ranking/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/team/members").permitAll()

                        // 3. CHỈ CÓ XEM PROFILE CÁ NHÂN HOẶC SỬA DATA MỚI CẦN TOKEN
                        .requestMatchers("/api/v1/team/members/**").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}