package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Lease;
import com.example.propertymanagement.repository.LeaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    @Autowired
    private LeaseRepository leaseRepository;

    @GetMapping
    public List<Lease> getAll() {
        return leaseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lease> getById(@PathVariable UUID id) {
        Optional<Lease> entity = leaseRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lease> create(@RequestBody Lease lease) {
        Lease savedEntity = leaseRepository.save(lease);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lease> update(@PathVariable UUID id, @RequestBody Lease lease) {
        if (!leaseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Lease updatedEntity = leaseRepository.save(lease);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!leaseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leaseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
