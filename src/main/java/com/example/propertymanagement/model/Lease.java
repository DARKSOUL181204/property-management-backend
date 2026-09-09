package com.example.propertymanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lease")
public class Lease {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID leaseId;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_tenant_id")
    private RentalTenant rentalTenant;

    @OneToMany(mappedBy = "lease", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invoice> invoices;
}
