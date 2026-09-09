package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.UnitDto;
import com.example.propertymanagement.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @GetMapping
    public ResponseEntity<List<UnitDto>> getAll() {
        return ResponseEntity.ok(unitService.getAllUnits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnitDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(unitService.getUnitById(id));
    }

    @PostMapping
    public ResponseEntity<UnitDto> create(@RequestBody UnitDto unitDto) {
        return new ResponseEntity<>(unitService.createUnit(unitDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnitDto> update(@PathVariable UUID id, @RequestBody UnitDto unitDto) {
        return ResponseEntity.ok(unitService.updateUnit(id, unitDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        unitService.deleteUnit(id);
        return ResponseEntity.ok("Unit deleted successfully.");
    }
}
