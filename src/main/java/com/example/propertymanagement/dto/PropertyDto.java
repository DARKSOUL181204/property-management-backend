package com.example.propertymanagement.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class PropertyDto {
    private UUID propertyId;
    private String name;
    private String propertyType;
    private Integer totalUnits;
    private String status;
    private UUID organizationOrganizationId;
}
