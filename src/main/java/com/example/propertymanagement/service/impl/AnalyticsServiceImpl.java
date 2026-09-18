package com.example.propertymanagement.service.impl;

import com.example.propertymanagement.model.*;
import com.example.propertymanagement.repository.*;
import com.example.propertymanagement.service.AnalyticsService;
import com.example.propertymanagement.payload.response.analytics.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private UnitRepository unitRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private MaintenanceRequestRepository maintenanceRepository;
    @Autowired
    private LeaseRepository leaseRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public OccupancyAnalysisResponse getOccupancyAnalysis(UUID propertyId) {
        List<Unit> units = unitRepository.findByPropertyPropertyId(propertyId);
        int total = units.size();
        int occupied = (int) units.stream().filter(u -> "OCCUPIED".equalsIgnoreCase(u.getStatus())).count();
        
        OccupancyAnalysisResponse response = new OccupancyAnalysisResponse();
        response.setPropertyId(propertyId);
        response.setTotalUnits(total);
        response.setOccupiedUnits(occupied);
        response.setVacantUnits(total - occupied);
        response.setOccupancyRate(total > 0 ? ((double) occupied / total) * 100 : 0.0);
        return response;
    }

    @Override
    public RentCollectionAnalysisResponse getRentCollectionAnalysis(UUID propertyId) {
        List<Unit> units = unitRepository.findByPropertyPropertyId(propertyId);
        List<Lease> leases = units.stream()
                .flatMap(u -> leaseRepository.findAll().stream().filter(l -> l.getUnit() != null && l.getUnit().getUnitId().equals(u.getUnitId())))
                .toList();
        
        List<Invoice> invoices = leases.stream()
                .flatMap(l -> invoiceRepository.findAll().stream().filter(i -> i.getLease() != null && i.getLease().getLeaseId().equals(l.getLeaseId())))
                .toList();

        BigDecimal expected = invoices.stream().map(Invoice::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal collected = invoices.stream()
                .flatMap(i -> paymentRepository.findAll().stream().filter(p -> p.getInvoice() != null && p.getInvoice().getInvoiceId().equals(i.getInvoiceId())))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        RentCollectionAnalysisResponse response = new RentCollectionAnalysisResponse();
        response.setPropertyId(propertyId);
        response.setExpectedRent(expected);
        response.setCollectedRent(collected);
        response.setOutstandingRent(expected.subtract(collected).max(BigDecimal.ZERO));
        if (expected.compareTo(BigDecimal.ZERO) > 0) {
            response.setCollectionRate(collected.divide(expected, 4, RoundingMode.HALF_UP).doubleValue() * 100);
        } else {
            response.setCollectionRate(0.0);
        }
        return response;
    }

    @Override
    public ProfitabilityAnalysisResponse getProfitabilityAnalysis(UUID propertyId) {
        RentCollectionAnalysisResponse rent = getRentCollectionAnalysis(propertyId);
        ExpenseAnalysisResponse expense = getExpenseAnalysis(propertyId);

        ProfitabilityAnalysisResponse response = new ProfitabilityAnalysisResponse();
        response.setPropertyId(propertyId);
        response.setTotalRevenue(rent.getCollectedRent());
        response.setTotalExpenses(expense.getTotalExpenses());
        response.setNetProfit(rent.getCollectedRent().subtract(expense.getTotalExpenses()));
        
        if (rent.getCollectedRent().compareTo(BigDecimal.ZERO) > 0) {
            response.setProfitMargin(response.getNetProfit().divide(rent.getCollectedRent(), 4, RoundingMode.HALF_UP).doubleValue() * 100);
        } else {
            response.setProfitMargin(0.0);
        }
        
        Property p = propertyRepository.findById(propertyId).orElse(null);
        BigDecimal buildCost = (p != null && p.getBuildCost() != null) ? p.getBuildCost() : BigDecimal.ZERO;
        response.setBuildCost(buildCost);
        
        if (buildCost.compareTo(BigDecimal.ZERO) > 0) {
            response.setRoiPercentage(response.getNetProfit().divide(buildCost, 4, RoundingMode.HALF_UP).doubleValue() * 100);
        } else {
            response.setRoiPercentage(0.0);
        }
        
        return response;
    }

    @Override
    public ExpenseAnalysisResponse getExpenseAnalysis(UUID propertyId) {
        List<Expense> expenses = expenseRepository.findByPropertyPropertyId(propertyId);
        
        Map<String, BigDecimal> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
        
        // Ensure no category drops below zero
        byCategory.replaceAll((k, v) -> v.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : v);
        
        BigDecimal total = byCategory.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        ExpenseAnalysisResponse response = new ExpenseAnalysisResponse();
        response.setPropertyId(propertyId);
        response.setTotalExpenses(total);
        response.setExpensesByCategory(byCategory);
        return response;
    }

    @Override
    public MaintenanceAnalysisResponse getMaintenanceAnalysis(UUID propertyId) {
        List<MaintenanceRequest> requests = maintenanceRepository.findByPropertyPropertyId(propertyId);
        
        int open = (int) requests.stream().filter(r -> "OPEN".equalsIgnoreCase(r.getStatus())).count();
        int inProg = (int) requests.stream().filter(r -> "IN_PROGRESS".equalsIgnoreCase(r.getStatus())).count();
        int resolved = (int) requests.stream().filter(r -> "RESOLVED".equalsIgnoreCase(r.getStatus()) || "CLOSED".equalsIgnoreCase(r.getStatus())).count();

        MaintenanceAnalysisResponse response = new MaintenanceAnalysisResponse();
        response.setPropertyId(propertyId);
        response.setTotalRequests(requests.size());
        response.setOpenRequests(open);
        response.setInProgressRequests(inProg);
        response.setResolvedRequests(resolved);
        return response;
    }

    @Override
    public PropertyPerformanceResponse getPropertyPerformance(UUID propertyId) {
        PropertyPerformanceResponse response = new PropertyPerformanceResponse();
        response.setPropertyId(propertyId);
        response.setOccupancy(getOccupancyAnalysis(propertyId));
        response.setRentCollection(getRentCollectionAnalysis(propertyId));
        response.setProfitability(getProfitabilityAnalysis(propertyId));
        response.setExpenses(getExpenseAnalysis(propertyId));
        response.setMaintenance(getMaintenanceAnalysis(propertyId));
        
        double occupancy = response.getOccupancy().getOccupancyRate();
        double profitMargin = response.getProfitability().getProfitMargin();
        int openIssues = response.getMaintenance().getOpenRequests();
        
        // Dynamic Health Score based on Occupancy, Profit Margin, Maintenance, and ROI
        Double roi = response.getProfitability().getRoiPercentage();
        if (roi != null && roi >= 100.0) {
            response.setOverallHealthScore("EXCELLENT");
        } else if (occupancy >= 80.0 && profitMargin >= 40.0 && openIssues <= 2) {
            response.setOverallHealthScore("EXCELLENT");
        } else if (occupancy >= 60.0 && profitMargin >= 20.0 && openIssues <= 5) {
            response.setOverallHealthScore("GOOD");
        } else if (profitMargin > 5.0) {
            response.setOverallHealthScore("MODERATE");
        } else if (profitMargin <= 5.0 && profitMargin >= -10.0) {
            response.setOverallHealthScore("POOR");
        } else {
            response.setOverallHealthScore("CRITICAL");
        }
        
        return response;
    }
}
