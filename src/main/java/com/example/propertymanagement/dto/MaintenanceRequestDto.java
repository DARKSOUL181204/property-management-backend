package com.example.propertymanagement.dto;
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
