package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.LeadInquiry;
import com.example.propertymanagement.repository.LeadInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/leadinquiries")
public class LeadInquiryController {

    @Autowired
    private LeadInquiryRepository leadInquiryRepository;

    @GetMapping
    public List<LeadInquiry> getAll() {
        return leadInquiryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadInquiry> getById(@PathVariable UUID id) {
        Optional<LeadInquiry> entity = leadInquiryRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LeadInquiry> create(@RequestBody LeadInquiry leadInquiry) {
        LeadInquiry savedEntity = leadInquiryRepository.save(leadInquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadInquiry> update(@PathVariable UUID id, @RequestBody LeadInquiry leadInquiry) {
        if (!leadInquiryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        LeadInquiry updatedEntity = leadInquiryRepository.save(leadInquiry);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!leadInquiryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leadInquiryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
