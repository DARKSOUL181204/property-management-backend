package com.example.propertymanagement.dto;
import java.util.UUID;

import lombok.Data;

@Data
public class PropertyDto {
    private UUID propertyId;
    private String name;
    private String description;
    private String imageUrl;
    private String propertyType;
    private Integer totalUnits;
    private String status;
    private String transactionType;
    private Double maintenanceFee;
    private String healthState;
    private UUID organizationOrganizationId;
}
