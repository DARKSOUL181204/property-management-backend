package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAll() {
        return ResponseEntity.ok(propertyService.getAllPropertys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyDto> create(@RequestBody PropertyDto propertyDto) {
        return new ResponseEntity<>(propertyService.createProperty(propertyDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> update(@PathVariable UUID id, @RequestBody PropertyDto propertyDto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, propertyDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property deleted successfully.");
    }
}
