package com.example.propertymanagement.repository;

import com.example.propertymanagement.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    java.util.List<com.example.propertymanagement.model.Expense> findByPropertyPropertyId(java.util.UUID propertyId);
}
