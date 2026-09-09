package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.MaintenanceRequestDto;
import com.example.propertymanagement.service.MaintenanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance-requests")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestService maintenanceRequestService;

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestDto>> getAll() {
        return ResponseEntity.ok(maintenanceRequestService.getAllMaintenanceRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequestDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(maintenanceRequestService.getMaintenanceRequestById(id));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequestDto> create(@RequestBody MaintenanceRequestDto maintenanceRequestDto) {
        return new ResponseEntity<>(maintenanceRequestService.createMaintenanceRequest(maintenanceRequestDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRequestDto> update(@PathVariable UUID id, @RequestBody MaintenanceRequestDto maintenanceRequestDto) {
        return ResponseEntity.ok(maintenanceRequestService.updateMaintenanceRequest(id, maintenanceRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        maintenanceRequestService.deleteMaintenanceRequest(id);
        return ResponseEntity.ok("MaintenanceRequest deleted successfully.");
    }
}
