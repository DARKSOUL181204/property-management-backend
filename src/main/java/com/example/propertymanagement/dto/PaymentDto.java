package com.example.propertymanagement.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class PaymentDto {
    private UUID paymentId;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private UUID invoiceInvoiceId;
}
