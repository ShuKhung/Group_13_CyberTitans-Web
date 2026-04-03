package com.Se2.CyberWebApp.security; // Đảm bảo đúng tên thư mục của bạn

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import com.Se2.CyberWebApp.entity.User;
@Component
public class JwtUtil {

   
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =========================================================
    // Feature 1: Generate Token
    // =========================================================

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();

        if (user.getRoleEntity() != null) {
            claims.put("role", user.getRoleEntity().getName());
        } else {
            claims.put("role", "MEMBER");
        }

        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName) 
                .setIssuedAt(new Date(System.currentTimeMillis())) 
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) 
                .signWith(getSignKey(), SignatureAlgorithm.HS256) 
                .compact();
    }

    // =========================================================
    // Feature 2: Extract Data from Token
    // =========================================================
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =========================================================
    // Feature 3: Validate Token
    // =========================================================
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}