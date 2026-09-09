package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PublicListingDto {
    private UUID listingId;
    private String title;
    private BigDecimal listedPrice;
    private String status;
    private UUID organizationOrganizationId;
    private UUID propertyPropertyId;
    private UUID unitUnitId;
}
