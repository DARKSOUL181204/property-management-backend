package com.example.propertymanagement.controller;

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
