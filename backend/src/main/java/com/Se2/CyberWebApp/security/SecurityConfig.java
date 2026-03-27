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
                        // 1. GUEST: Các API mở cửa tự do
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/ranking/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/team/members").permitAll()

                        // 2. ADMIN: Khu vực tuyệt mật
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/team/members/**")
                        .hasAnyAuthority("ADMIN", "SUPER ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/team/members/**").hasAnyAuthority("ADMIN", "SUPER ADMIN")

                        // 3. MENTOR: Chỉ sư phụ mới có quyền phản hồi request
                        .requestMatchers("/api/v1/mentor/responses").hasAuthority("MENTOR")

                        // 4. Các quyền cơ bản khi đã đăng nhập
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