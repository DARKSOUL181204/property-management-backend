package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.MaintenanceRequest;
import com.example.propertymanagement.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance-requests")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @GetMapping
    public List<MaintenanceRequest> getAll() {
        return maintenanceRequestRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getById(@PathVariable UUID id) {
        Optional<MaintenanceRequest> entity = maintenanceRequestRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@RequestBody MaintenanceRequest maintenanceRequest) {
        MaintenanceRequest savedEntity = maintenanceRequestRepository.save(maintenanceRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> update(@PathVariable UUID id, @RequestBody MaintenanceRequest maintenanceRequest) {
        if (!maintenanceRequestRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        MaintenanceRequest updatedEntity = maintenanceRequestRepository.save(maintenanceRequest);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!maintenanceRequestRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        maintenanceRequestRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
