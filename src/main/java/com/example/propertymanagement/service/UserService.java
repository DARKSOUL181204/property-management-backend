package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.UserDto;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UserDto createUser(UserDto userDto);
    List<UserDto> getAllUsers();
    UserDto getUserById(UUID id);
    UserDto updateUser(UUID id, UserDto userDto);
    void deleteUser(UUID id);
}
