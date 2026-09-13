package com.example.propertymanagement.service;

import com.example.propertymanagement.payload.response.analytics.*;
import java.util.UUID;

public interface AnalyticsService {
    OccupancyAnalysisResponse getOccupancyAnalysis(UUID propertyId);
    RentCollectionAnalysisResponse getRentCollectionAnalysis(UUID propertyId);
    ProfitabilityAnalysisResponse getProfitabilityAnalysis(UUID propertyId);
    ExpenseAnalysisResponse getExpenseAnalysis(UUID propertyId);
    MaintenanceAnalysisResponse getMaintenanceAnalysis(UUID propertyId);
    PropertyPerformanceResponse getPropertyPerformance(UUID propertyId);
}
