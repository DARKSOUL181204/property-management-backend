package com.example.propertymanagement.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LeadInquiryDto {
    private UUID inquiryId;
    private String prospectName;
    private String status;
    private LocalDateTime createdAt;
    private UUID organizationOrganizationId;
    private UUID publicListingListingId;
}
