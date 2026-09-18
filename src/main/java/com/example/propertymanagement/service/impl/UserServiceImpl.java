package com.example.propertymanagement.service.impl;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


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
        if (request.getCanEditPrice() != null) {
            user.setCanEditPrice(request.getCanEditPrice());
        }
        
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null && ("MANAGER".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole())) && user.getOrganization() != null) {
                return userRepository.findAll().stream()
                        .filter(e -> e.getOrganization() != null && e.getOrganization().getOrganizationId().equals(user.getOrganization().getOrganizationId()))
                        .map(e -> modelMapper.map(e, UserResponse.class))
                        .toList();
            }
        }
        return userRepository.findAll().stream().map(e -> modelMapper.map(e, UserResponse.class)).toList();
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
        if (request.getCanEditPrice() != null) {
            user.setCanEditPrice(request.getCanEditPrice());
        }
        
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
