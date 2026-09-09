package com.example.propertymanagement.dto;
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
