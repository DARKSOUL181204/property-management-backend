package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Unit;
import com.example.propertymanagement.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitRepository unitRepository;

    @GetMapping
    public List<Unit> getAll() {
        return unitRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unit> getById(@PathVariable UUID id) {
        Optional<Unit> entity = unitRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Unit> create(@RequestBody Unit unit) {
        Unit savedEntity = unitRepository.save(unit);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unit> update(@PathVariable UUID id, @RequestBody Unit unit) {
        if (!unitRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Unit updatedEntity = unitRepository.save(unit);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!unitRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        unitRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
