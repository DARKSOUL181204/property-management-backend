package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.payload.AuthResponse;
import com.example.propertymanagement.payload.LoginRequest;
import com.example.propertymanagement.payload.RegisterRequest;
import com.example.propertymanagement.repository.OrganizationRepository;
import com.example.propertymanagement.repository.UserRepository;
import com.example.propertymanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setStatus("ACTIVE");

        if (registerRequest.getOrgName() != null && !registerRequest.getOrgName().trim().isEmpty()) {
            // Registering as an Organization
            Organization org = new Organization();
            org.setName(registerRequest.getOrgName());
            org.setEmail(registerRequest.getEmail());
            org.setStatus("ACTIVE");
            org = organizationRepository.save(org);

            user.setOrganization(org);
            user.setRole("ADMIN"); // The person creating the org is the Admin
            user.setCanEditPrice(true);
        } else {
            // Standard Customer
            user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "USER");
            user.setCanEditPrice(false);
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
