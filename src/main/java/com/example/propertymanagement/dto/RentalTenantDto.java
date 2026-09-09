package com.example.propertymanagement.dto;
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
