package com.example.propertymanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rental_tenant")
public class RentalTenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID rentalTenantId;

    private String name;
    private String email;
    private String idNumber;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @OneToMany(mappedBy = "rentalTenant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lease> leases;

    @OneToMany(mappedBy = "rentalTenant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MaintenanceRequest> maintenanceRequests;
}
