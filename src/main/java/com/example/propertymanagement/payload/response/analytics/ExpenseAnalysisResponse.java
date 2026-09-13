package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
@Data
public class ExpenseAnalysisResponse {
    private UUID propertyId;
    private BigDecimal totalExpenses;
    private Map<String, BigDecimal> expensesByCategory;
}