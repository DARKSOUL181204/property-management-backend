package com.example.propertymanagement.service;

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
