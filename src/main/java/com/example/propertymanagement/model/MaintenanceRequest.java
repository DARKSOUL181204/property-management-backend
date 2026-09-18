package com.example.propertymanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID requestId;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @ManyToOne
    @JoinColumn(name = "rental_tenant_id")
    private RentalTenant rentalTenant;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    private String category;
    
    @Column(length = 1000)
    private String description;
    
    private String requestDate;
    private String scheduledDate;
    private String denyReason;

    private String status; // PENDING, IN_PROGRESS, RESOLVED, CLOSED, DENIED, PARTIALLY_RESOLVED
}
