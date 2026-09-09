import os

base_dir = "/Users/chetan/.gemini/antigravity/scratch/property_management/src/main/java/com/example/propertymanagement"

# 1. Update User Entity
user_entity_path = os.path.join(base_dir, "model", "User.java")
with open(user_entity_path, "r") as f:
    user_content = f.read()

if "private String email;" not in user_content:
    user_content = user_content.replace(
        "private String name;",
        "private String name;\n    @Column(unique = true)\n    private String email;\n    private String password;"
    )
    user_content = user_content.replace(
        "import jakarta.persistence.*;",
        "import jakarta.persistence.*;\nimport org.springframework.security.core.GrantedAuthority;\nimport org.springframework.security.core.authority.SimpleGrantedAuthority;\nimport org.springframework.security.core.userdetails.UserDetails;\nimport java.util.Collection;\nimport java.util.List;"
    )
    
    # We implement UserDetails for Spring Security directly on the User model
    user_content = user_content.replace(
        "public class User {",
        "public class User implements UserDetails {\n\n    @Override\n    public Collection<? extends GrantedAuthority> getAuthorities() {\n        return List.of(new SimpleGrantedAuthority(\"ROLE_\" + (role != null ? role.toUpperCase() : \"USER\")));\n    }\n\n    @Override\n    public String getUsername() {\n        return email;\n    }\n\n    @Override\n    public boolean isAccountNonExpired() {\n        return true;\n    }\n\n    @Override\n    public boolean isAccountNonLocked() {\n        return true;\n    }\n\n    @Override\n    public boolean isCredentialsNonExpired() {\n        return true;\n    }\n\n    @Override\n    public boolean isEnabled() {\n        return \"ACTIVE\".equalsIgnoreCase(status);\n    }\n"
    )
    with open(user_entity_path, "w") as f:
        f.write(user_content)

# Update User Repository
user_repo_path = os.path.join(base_dir, "repository", "UserRepository.java")
with open(user_repo_path, "r") as f:
    repo_content = f.read()
if "Optional<User> findByEmail" not in repo_content:
    repo_content = repo_content.replace(
        "}",
        "    java.util.Optional<User> findByEmail(String email);\n}"
    )
    with open(user_repo_path, "w") as f:
        f.write(repo_content)


# 2. Flatten DTOs
dtos = {
    "OrganizationDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class OrganizationDto {
    private UUID organizationId;
    private String name;
    private String email;
    private String status;
    private LocalDateTime createdAt;
}
""",
    "UserDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class UserDto {
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private String status;
    private UUID organizationOrganizationId; 
}
""",
    "RentalTenantDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class RentalTenantDto {
    private UUID rentalTenantId;
    private String name;
    private String email;
    private String idNumber;
    private String status;
    private UUID organizationOrganizationId;
}
""",
    "PropertyDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class PropertyDto {
    private UUID propertyId;
    private String name;
    private String propertyType;
    private Integer totalUnits;
    private String status;
    private UUID organizationOrganizationId;
}
""",
    "UnitDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UnitDto {
    private UUID unitId;
    private String unitNumber;
    private String unitType;
    private BigDecimal monthlyRent;
    private String status;
    private UUID propertyPropertyId;
}
""",
    "ExpenseDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ExpenseDto {
    private UUID expenseId;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private UUID organizationOrganizationId;
    private UUID propertyPropertyId;
}
""",
    "MaintenanceRequestDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class MaintenanceRequestDto {
    private UUID requestId;
    private String category;
    private String status;
    private UUID propertyPropertyId;
    private UUID unitUnitId;
    private UUID rentalTenantRentalTenantId;
}
""",
    "LeaseDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class LeaseDto {
    private UUID leaseId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private String status;
    private UUID unitUnitId;
    private UUID rentalTenantRentalTenantId;
}
""",
    "InvoiceDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class InvoiceDto {
    private UUID invoiceId;
    private String billingMonth;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private String status;
    private UUID leaseLeaseId;
}
""",
    "PaymentDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class PaymentDto {
    private UUID paymentId;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private UUID invoiceInvoiceId;
}
""",
    "PublicListingDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PublicListingDto {
    private UUID listingId;
    private String title;
    private BigDecimal listedPrice;
    private String status;
    private UUID organizationOrganizationId;
    private UUID propertyPropertyId;
    private UUID unitUnitId;
}
""",
    "LeadInquiryDto": """package com.example.propertymanagement.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LeadInquiryDto {
    private UUID inquiryId;
    private String prospectName;
    private String status;
    private LocalDateTime createdAt;
    private UUID organizationOrganizationId;
    private UUID publicListingListingId;
}
"""
}

# Write DTOs
for name, content in dtos.items():
    with open(os.path.join(base_dir, "dto", f"{name}.java"), "w") as f:
        f.write(content)

# 3. Add Security Payloads
os.makedirs(os.path.join(base_dir, "payload"), exist_ok=True)
payloads = {
    "LoginRequest.java": """package com.example.propertymanagement.payload;
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
    private String password;
}""",
    "RegisterRequest.java": """package com.example.propertymanagement.payload;
import lombok.Data;
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}""",
    "AuthResponse.java": """package com.example.propertymanagement.payload;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}"""
}
for name, content in payloads.items():
    with open(os.path.join(base_dir, "payload", name), "w") as f:
        f.write(content)

# 4. Implement Full JWT Security
security_files = {
    "JwtUtil.java": """package com.example.propertymanagement.security;

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
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
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
""",
    "UserDetailsServiceImpl.java": """package com.example.propertymanagement.security;

import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user; // User entity implements UserDetails
    }
}
""",
    "JwtAuthenticationFilter.java": """package com.example.propertymanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
                String username = jwtUtil.getUsernameFromToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
""",
    "SecurityConfig.java": """package com.example.propertymanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
            
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
"""
}

for name, content in security_files.items():
    with open(os.path.join(base_dir, "security", name), "w") as f:
        f.write(content)

# 5. Overwrite Auth Controller
auth_controller_path = os.path.join(base_dir, "controller", "AuthController.java")
auth_content = """package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.User;
import com.example.propertymanagement.payload.AuthResponse;
import com.example.propertymanagement.payload.LoginRequest;
import com.example.propertymanagement.payload.RegisterRequest;
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
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "USER");
        user.setStatus("ACTIVE");

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
"""
with open(auth_controller_path, "w") as f:
    f.write(auth_content)

print("Refined DTOs and Security implementation finished!")
