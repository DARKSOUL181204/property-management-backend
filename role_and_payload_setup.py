import os

base_dir = "/Users/chetan/.gemini/antigravity/scratch/property_management/src/main/java/com/example/propertymanagement"

# 1. Enable Method Security
sec_config = os.path.join(base_dir, "security", "SecurityConfig.java")
with open(sec_config, 'r') as f:
    content = f.read()
if "@EnableMethodSecurity" not in content:
    content = content.replace("import org.springframework.context.annotation.Configuration;", "import org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;")
    content = content.replace("@Configuration", "@Configuration\n@EnableMethodSecurity")
    with open(sec_config, 'w') as f:
        f.write(content)

# 2. Create Payload classes for User
req_dir = os.path.join(base_dir, "payload", "request")
res_dir = os.path.join(base_dir, "payload", "response")
os.makedirs(req_dir, exist_ok=True)
os.makedirs(res_dir, exist_ok=True)

with open(os.path.join(req_dir, "CreateUserRequest.java"), 'w') as f:
    f.write("""package com.example.propertymanagement.payload.request;
import lombok.Data;
import java.util.UUID;
@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String status;
    private UUID organizationId;
}
""")

with open(os.path.join(res_dir, "UserResponse.java"), 'w') as f:
    f.write("""package com.example.propertymanagement.payload.response;
import lombok.Data;
import java.util.UUID;
@Data
public class UserResponse {
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private String status;
    private UUID organizationOrganizationId;
}
""")

# 3. Update UserService
service_path = os.path.join(base_dir, "service", "UserService.java")
with open(service_path, 'w') as f:
    f.write("""package com.example.propertymanagement.service;

import com.example.propertymanagement.payload.request.CreateUserRequest;
import com.example.propertymanagement.payload.response.UserResponse;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UserResponse createUser(CreateUserRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(UUID id);
    UserResponse updateUser(UUID id, CreateUserRequest request);
    void deleteUser(UUID id);
}
""")

# 4. Update UserServiceImpl
impl_path = os.path.join(base_dir, "service", "impl", "UserServiceImpl.java")
with open(impl_path, 'w') as f:
    f.write("""package com.example.propertymanagement.service.impl;

import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.repository.UserRepository;
import com.example.propertymanagement.repository.OrganizationRepository;
import com.example.propertymanagement.service.UserService;
import com.example.propertymanagement.payload.request.CreateUserRequest;
import com.example.propertymanagement.payload.response.UserResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        
        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", request.getOrganizationId()));
            user.setOrganization(org);
        }

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserResponse.class);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );
        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public UserResponse updateUser(UUID id, CreateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );
        
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        if(request.getPassword() != null && !request.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        
        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", request.getOrganizationId()));
            user.setOrganization(org);
        }
        
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserResponse.class);
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );
        userRepository.delete(user);
    }
}
""")

# 5. Update UserController
controller_path = os.path.join(base_dir, "controller", "UserController.java")
with open(controller_path, 'w') as f:
    f.write("""package com.example.propertymanagement.controller;

import com.example.propertymanagement.payload.request.CreateUserRequest;
import com.example.propertymanagement.payload.response.UserResponse;
import com.example.propertymanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<UserResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> create(@RequestBody CreateUserRequest request) {
        return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> update(@PathVariable UUID id, @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
""")

print("Successfully updated User with specific Request/Response payloads and Role-based JWT security.")
