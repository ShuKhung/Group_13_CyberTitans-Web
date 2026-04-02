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
                // 1. CẤU HÌNH CORS (Giữ nguyên của bạn)
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
                        // --- MỞ KHÓA TÀI NGUYÊN TĨNH (Sửa lại cho đúng chuẩn) ---
                        .requestMatchers(
                                "/", "/home", "/services/**",
                                "/projects/**", "/team/**", "/ranking/**", "/faq/**",
                                "/publications/**", "/api/publications/**",
                                "/login", "/error", "/CSS/**", "/js/**", "/images/**",
                                "/**/*.css", "/**/*.js", "/favicon.ico"
                        ).permitAll()

                        // 1. GUEST: Các API mở cửa tự do
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/ranking/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/team/members").permitAll()

                        // 2. ADMIN, SUPER ADMIN & MENTOR
                        .requestMatchers("/admin/**", "/api/v1/admin/**").hasAnyAuthority("ADMIN", "SUPER ADMIN")
                        .requestMatchers("/api/v1/super-admin/**", "/permissions/**").hasAuthority("SUPER ADMIN")
                        .requestMatchers("/api/v1/mentor/**").hasAnyAuthority("MENTOR", "ADMIN", "SUPER ADMIN")

                        // 3. SECURE PROFILE
                        .requestMatchers("/profile", "/api/v1/user/**").authenticated()

                        // 4. Default fallthrough
                        .anyRequest().permitAll()
                )
                // We enable FORM LOGIN or at least standard session support if we use Cookies for SSR
                // But since we use JwtAuthFilter with Cookies, STATELESS can usually stay, 
                // but let's ensure the Filter is properly ordered.
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}