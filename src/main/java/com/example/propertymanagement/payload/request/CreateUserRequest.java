package com.example.propertymanagement.payload.request;
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
