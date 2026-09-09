package com.example.propertymanagement.controller;

import com.example.propertymanagement.dto.LeadInquiryDto;
import com.example.propertymanagement.service.LeadInquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leadinquiries")
public class LeadInquiryController {

    @Autowired
    private LeadInquiryService leadInquiryService;

    @GetMapping
    public ResponseEntity<List<LeadInquiryDto>> getAll() {
        return ResponseEntity.ok(leadInquiryService.getAllLeadInquirys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadInquiryDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(leadInquiryService.getLeadInquiryById(id));
    }

    @PostMapping
    public ResponseEntity<LeadInquiryDto> create(@RequestBody LeadInquiryDto leadInquiryDto) {
        return new ResponseEntity<>(leadInquiryService.createLeadInquiry(leadInquiryDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadInquiryDto> update(@PathVariable UUID id, @RequestBody LeadInquiryDto leadInquiryDto) {
        return ResponseEntity.ok(leadInquiryService.updateLeadInquiry(id, leadInquiryDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        leadInquiryService.deleteLeadInquiry(id);
        return ResponseEntity.ok("LeadInquiry deleted successfully.");
    }
}
