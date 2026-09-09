package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ExpenseDto {
    private UUID expenseId;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private UUID organizationOrganizationId;
    private UUID propertyPropertyId;
}
