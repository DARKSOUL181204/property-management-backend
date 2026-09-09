package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UnitDto {
    private UUID unitId;
    private String unitNumber;
    private String unitType;
    private BigDecimal monthlyRent;
    private String status;
    private UUID propertyPropertyId;
}
