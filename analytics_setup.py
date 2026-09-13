import os

base_dir = "/Users/chetan/Java Projects /property_management/src/main/java/com/example/propertymanagement"

# 1. Create Payload DTOs
payload_dir = os.path.join(base_dir, "payload", "response", "analytics")
os.makedirs(payload_dir, exist_ok=True)

dtos = {
    "OccupancyAnalysisResponse.java": """package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.util.UUID;
@Data
public class OccupancyAnalysisResponse {
    private UUID propertyId;
    private int totalUnits;
    private int occupiedUnits;
    private int vacantUnits;
    private double occupancyRate;
}""",
    "RentCollectionAnalysisResponse.java": """package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
@Data
public class RentCollectionAnalysisResponse {
    private UUID propertyId;
    private BigDecimal expectedRent;
    private BigDecimal collectedRent;
    private BigDecimal outstandingRent;
    private double collectionRate;
}""",
    "ProfitabilityAnalysisResponse.java": """package com.example.propertymanagement.payload.response.analytics;
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
}""",
    "ExpenseAnalysisResponse.java": """package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
@Data
public class ExpenseAnalysisResponse {
    private UUID propertyId;
    private BigDecimal totalExpenses;
    private Map<String, BigDecimal> expensesByCategory;
}""",
    "MaintenanceAnalysisResponse.java": """package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.util.UUID;
@Data
public class MaintenanceAnalysisResponse {
    private UUID propertyId;
    private int totalRequests;
    private int openRequests;
    private int inProgressRequests;
    private int resolvedRequests;
}""",
    "PropertyPerformanceResponse.java": """package com.example.propertymanagement.payload.response.analytics;
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
}"""
}

for name, content in dtos.items():
    with open(os.path.join(payload_dir, name), "w") as f:
        f.write(content)

# 2. Add methods to repositories
repo_dir = os.path.join(base_dir, "repository")

def ensure_method(repo_file, method):
    with open(os.path.join(repo_dir, repo_file), "r") as f:
        content = f.read()
    if method not in content:
        content = content.replace("}", f"    {method}\n}}")
        with open(os.path.join(repo_dir, repo_file), "w") as f:
            f.write(content)

ensure_method("UnitRepository.java", "java.util.List<com.example.propertymanagement.model.Unit> findByPropertyPropertyId(java.util.UUID propertyId);")
ensure_method("ExpenseRepository.java", "java.util.List<com.example.propertymanagement.model.Expense> findByPropertyPropertyId(java.util.UUID propertyId);")
ensure_method("MaintenanceRequestRepository.java", "java.util.List<com.example.propertymanagement.model.MaintenanceRequest> findByPropertyPropertyId(java.util.UUID propertyId);")


# 3. Create AnalyticsService
with open(os.path.join(base_dir, "service", "AnalyticsService.java"), "w") as f:
    f.write("""package com.example.propertymanagement.service;

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
""")

# 4. Create AnalyticsServiceImpl
os.makedirs(os.path.join(base_dir, "service", "impl"), exist_ok=True)
with open(os.path.join(base_dir, "service", "impl", "AnalyticsServiceImpl.java"), "w") as f:
    f.write("""package com.example.propertymanagement.service.impl;

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
                .collect(Collectors.toList());
        
        List<Invoice> invoices = leases.stream()
                .flatMap(l -> invoiceRepository.findAll().stream().filter(i -> i.getLease() != null && i.getLease().getLeaseId().equals(l.getLeaseId())))
                .collect(Collectors.toList());

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
        return response;
    }

    @Override
    public ExpenseAnalysisResponse getExpenseAnalysis(UUID propertyId) {
        List<Expense> expenses = expenseRepository.findByPropertyPropertyId(propertyId);
        
        BigDecimal total = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, BigDecimal> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

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
        if (occupancy >= 90.0) {
            response.setOverallHealthScore("EXCELLENT");
        } else if (occupancy >= 70.0) {
            response.setOverallHealthScore("GOOD");
        } else {
            response.setOverallHealthScore("NEEDS ATTENTION");
        }
        
        return response;
    }
}
""")

# 5. Create AnalyticsController
with open(os.path.join(base_dir, "controller", "AnalyticsController.java"), "w") as f:
    f.write("""package com.example.propertymanagement.controller;

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
""")

print("Analytics Implementation scaffolded successfully!")
