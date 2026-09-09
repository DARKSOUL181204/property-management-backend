package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping
    public List<Organization> getAll() {
        return organizationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getById(@PathVariable UUID id) {
        Optional<Organization> entity = organizationRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Organization> create(@RequestBody Organization organization) {
        Organization savedEntity = organizationRepository.save(organization);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> update(@PathVariable UUID id, @RequestBody Organization organization) {
        if (!organizationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Organization updatedEntity = organizationRepository.save(organization);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!organizationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        organizationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
