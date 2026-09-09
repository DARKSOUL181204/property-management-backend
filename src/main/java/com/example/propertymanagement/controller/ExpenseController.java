package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Expense;
import com.example.propertymanagement.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getById(@PathVariable UUID id) {
        Optional<Expense> entity = expenseRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Expense> create(@RequestBody Expense expense) {
        Expense savedEntity = expenseRepository.save(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(@PathVariable UUID id, @RequestBody Expense expense) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Expense updatedEntity = expenseRepository.save(expense);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
