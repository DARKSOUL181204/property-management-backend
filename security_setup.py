import os

base_dir = "/Users/chetan/.gemini/antigravity/scratch/property_management/src/main/java/com/example/propertymanagement"

security_files = {
    "SecurityConfig.java": """package com.example.propertymanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
            
        // We are disabling JWT filter implementation for brevity, 
        // normally you'd add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter here.
        
        return http.build();
    }
}
""",
    "AuthController.java": """package com.example.propertymanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<String> login() {
        // Mock login response
        return ResponseEntity.ok("eyJhbGciOiJIUzI1NiJ9.MockToken.Signature");
    }
}
"""
}

with open(os.path.join(base_dir, "security", "SecurityConfig.java"), "w") as f:
    f.write(security_files["SecurityConfig.java"])

with open(os.path.join(base_dir, "controller", "AuthController.java"), "w") as f:
    f.write(security_files["AuthController.java"])

print("Security configuration added!")
