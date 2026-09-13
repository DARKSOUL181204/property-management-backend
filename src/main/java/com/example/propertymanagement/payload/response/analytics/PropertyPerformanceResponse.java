package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.util.UUID;
@Data
public class PropertyPerformanceResponse {
    private UUID propertyId;
    private OccupancyAnalysisResponse occupancy;
    private RentCollectionAnalysisResponse rentCollection;
    private ProfitabilityAnalysisResponse profitability;
    private ExpenseAnalysisResponse expenses;
    private MaintenanceAnalysisResponse maintenance;
    private String overallHealthScore; 
}