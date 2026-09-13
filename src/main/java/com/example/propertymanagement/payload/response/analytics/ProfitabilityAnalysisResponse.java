package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
@Data
public class ProfitabilityAnalysisResponse {
    private UUID propertyId;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private double profitMargin;
}