package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.RentalTenant;
import com.example.propertymanagement.repository.RentalTenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/rental-tenants")
public class RentalTenantController {

    @Autowired
    private RentalTenantRepository rentalTenantRepository;

    @GetMapping
    public List<RentalTenant> getAll() {
        return rentalTenantRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalTenant> getById(@PathVariable UUID id) {
        Optional<RentalTenant> entity = rentalTenantRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RentalTenant> create(@RequestBody RentalTenant rentalTenant) {
        RentalTenant savedEntity = rentalTenantRepository.save(rentalTenant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalTenant> update(@PathVariable UUID id, @RequestBody RentalTenant rentalTenant) {
        if (!rentalTenantRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        RentalTenant updatedEntity = rentalTenantRepository.save(rentalTenant);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!rentalTenantRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rentalTenantRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
