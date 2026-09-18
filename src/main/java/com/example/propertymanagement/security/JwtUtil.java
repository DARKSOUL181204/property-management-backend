package com.example.propertymanagement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final int jwtExpirationMs = 86400000; // 1 day

    public String generateToken(UserDetails userDetails) {
        String role = "USER";
        Boolean canEditPrice = true;
        if (userDetails instanceof com.example.propertymanagement.model.User) {
            com.example.propertymanagement.model.User u = (com.example.propertymanagement.model.User) userDetails;
            role = u.getRole();
            canEditPrice = u.getCanEditPrice();
        }

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role)
                .claim("canEditPrice", canEditPrice)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
