package com.example.propertymanagement.repository;

import com.example.propertymanagement.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByPropertyPropertyId(UUID propertyId);

    List<Expense> findByOrganizationOrganizationId(UUID organizationId);

    Optional<Expense> findByExpenseIdAndOrganizationOrganizationId(UUID expenseId, UUID organizationId);

    List<Expense> findByPropertyPropertyIdAndOrganizationOrganizationId(UUID propertyId, UUID organizationId);
}
