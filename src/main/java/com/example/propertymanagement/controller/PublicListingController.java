package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.PublicListing;
import com.example.propertymanagement.repository.PublicListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/public-listings")
public class PublicListingController {

    @Autowired
    private PublicListingRepository publicListingRepository;

    @GetMapping
    public List<PublicListing> getAll() {
        return publicListingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicListing> getById(@PathVariable UUID id) {
        Optional<PublicListing> entity = publicListingRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PublicListing> create(@RequestBody PublicListing publicListing) {
        PublicListing savedEntity = publicListingRepository.save(publicListing);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicListing> update(@PathVariable UUID id, @RequestBody PublicListing publicListing) {
        if (!publicListingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        PublicListing updatedEntity = publicListingRepository.save(publicListing);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!publicListingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        publicListingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
