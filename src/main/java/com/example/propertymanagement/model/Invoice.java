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
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID invoiceId;

    private String billingMonth;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lease_id")
    private Lease lease;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;
}
