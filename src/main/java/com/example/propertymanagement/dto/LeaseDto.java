package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class LeaseDto {
    private UUID leaseId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private String status;
    private UUID unitUnitId;
    private UUID rentalTenantRentalTenantId;
}
