package com.example.propertymanagement.dto;
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
