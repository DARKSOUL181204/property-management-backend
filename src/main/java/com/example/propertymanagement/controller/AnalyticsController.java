package com.example.propertymanagement.controller;

import com.example.propertymanagement.payload.response.analytics.*;
import com.example.propertymanagement.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics/properties/{propertyId}")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/occupancy")
    public ResponseEntity<OccupancyAnalysisResponse> getOccupancyAnalysis(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getOccupancyAnalysis(propertyId));
    }

    @GetMapping("/rent-collection")
    public ResponseEntity<RentCollectionAnalysisResponse> getRentCollectionAnalysis(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getRentCollectionAnalysis(propertyId));
    }

    @GetMapping("/profitability")
    public ResponseEntity<ProfitabilityAnalysisResponse> getProfitabilityAnalysis(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getProfitabilityAnalysis(propertyId));
    }

    @GetMapping("/expenses")
    public ResponseEntity<ExpenseAnalysisResponse> getExpenseAnalysis(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getExpenseAnalysis(propertyId));
    }

    @GetMapping("/maintenance")
    public ResponseEntity<MaintenanceAnalysisResponse> getMaintenanceAnalysis(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getMaintenanceAnalysis(propertyId));
    }

    @GetMapping("/performance")
    public ResponseEntity<PropertyPerformanceResponse> getPropertyPerformance(@PathVariable UUID propertyId) {
        return ResponseEntity.ok(analyticsService.getPropertyPerformance(propertyId));
    }
}
