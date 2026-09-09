package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.RentalTenantDto;
import com.example.propertymanagement.service.RentalTenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rental-tenants")
public class RentalTenantController {

    @Autowired
    private RentalTenantService rentalTenantService;

    @GetMapping
    public ResponseEntity<List<RentalTenantDto>> getAll() {
        return ResponseEntity.ok(rentalTenantService.getAllRentalTenants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalTenantDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(rentalTenantService.getRentalTenantById(id));
    }

    @PostMapping
    public ResponseEntity<RentalTenantDto> create(@RequestBody RentalTenantDto rentalTenantDto) {
        return new ResponseEntity<>(rentalTenantService.createRentalTenant(rentalTenantDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalTenantDto> update(@PathVariable UUID id, @RequestBody RentalTenantDto rentalTenantDto) {
        return ResponseEntity.ok(rentalTenantService.updateRentalTenant(id, rentalTenantDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        rentalTenantService.deleteRentalTenant(id);
        return ResponseEntity.ok("RentalTenant deleted successfully.");
    }
}
