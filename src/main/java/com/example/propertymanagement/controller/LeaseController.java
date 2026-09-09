package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.LeaseDto;
import com.example.propertymanagement.service.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    @Autowired
    private LeaseService leaseService;

    @GetMapping
    public ResponseEntity<List<LeaseDto>> getAll() {
        return ResponseEntity.ok(leaseService.getAllLeases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(leaseService.getLeaseById(id));
    }

    @PostMapping
    public ResponseEntity<LeaseDto> create(@RequestBody LeaseDto leaseDto) {
        return new ResponseEntity<>(leaseService.createLease(leaseDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaseDto> update(@PathVariable UUID id, @RequestBody LeaseDto leaseDto) {
        return ResponseEntity.ok(leaseService.updateLease(id, leaseDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        leaseService.deleteLease(id);
        return ResponseEntity.ok("Lease deleted successfully.");
    }
}
