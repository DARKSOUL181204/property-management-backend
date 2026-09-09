package com.example.propertymanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "public_listing")
public class PublicListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID listingId;

    private String title;
    private BigDecimal listedPrice;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @OneToMany(mappedBy = "publicListing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeadInquiry> leadInquiries;
}
