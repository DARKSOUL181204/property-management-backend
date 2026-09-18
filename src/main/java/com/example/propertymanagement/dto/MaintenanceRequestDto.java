package com.example.propertymanagement.dto;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
public class MaintenanceRequestDto {
    private UUID requestId;
    private String category;
    private String status;
    private String description;
    private LocalDate requestDate;
    private LocalDate scheduledDate;
    private UUID propertyPropertyId;
    private UUID unitUnitId;
    private UUID rentalTenantRentalTenantId;
}
