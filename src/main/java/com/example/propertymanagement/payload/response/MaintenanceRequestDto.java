package com.example.propertymanagement.payload.response;

import lombok.Data;
import java.util.UUID;

@Data
public class MaintenanceRequestDto {
    private UUID requestId;
    private UUID propertyPropertyId;
    private UUID unitUnitId;
    private UUID rentalTenantRentalTenantId;
    private UUID organizationOrganizationId;
    private String category;
    private String description;
    private String requestDate;
    private String scheduledDate;
    private String denyReason;
    private String status;
}
