package com.example.propertymanagement.payload.response;
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
