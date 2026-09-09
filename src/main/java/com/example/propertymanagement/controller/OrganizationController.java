package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.OrganizationDto;
import com.example.propertymanagement.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<List<OrganizationDto>> getAll() {
        return ResponseEntity.ok(organizationService.getAllOrganizations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizationDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(organizationService.getOrganizationById(id));
    }

    @PostMapping
    public ResponseEntity<OrganizationDto> create(@RequestBody OrganizationDto organizationDto) {
        return new ResponseEntity<>(organizationService.createOrganization(organizationDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizationDto> update(@PathVariable UUID id, @RequestBody OrganizationDto organizationDto) {
        return ResponseEntity.ok(organizationService.updateOrganization(id, organizationDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok("Organization deleted successfully.");
    }
}
