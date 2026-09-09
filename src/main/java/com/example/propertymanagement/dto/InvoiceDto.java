package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class InvoiceDto {
    private UUID invoiceId;
    private String billingMonth;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private String status;
    private UUID leaseLeaseId;
}
