package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @GetMapping
    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getById(@PathVariable UUID id) {
        Optional<Property> entity = propertyRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Property> create(@RequestBody Property property) {
        Property savedEntity = propertyRepository.save(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable UUID id, @RequestBody Property property) {
        if (!propertyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Property updatedEntity = propertyRepository.save(property);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!propertyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        propertyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
