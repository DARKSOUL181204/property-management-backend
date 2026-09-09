package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.PublicListingDto;
import com.example.propertymanagement.service.PublicListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public-listings")
public class PublicListingController {

    @Autowired
    private PublicListingService publicListingService;

    @GetMapping
    public ResponseEntity<List<PublicListingDto>> getAll() {
        return ResponseEntity.ok(publicListingService.getAllPublicListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicListingDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(publicListingService.getPublicListingById(id));
    }

    @PostMapping
    public ResponseEntity<PublicListingDto> create(@RequestBody PublicListingDto publicListingDto) {
        return new ResponseEntity<>(publicListingService.createPublicListing(publicListingDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicListingDto> update(@PathVariable UUID id, @RequestBody PublicListingDto publicListingDto) {
        return ResponseEntity.ok(publicListingService.updatePublicListing(id, publicListingDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        publicListingService.deletePublicListing(id);
        return ResponseEntity.ok("PublicListing deleted successfully.");
    }
}
