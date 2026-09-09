package com.example.propertymanagement.controller;

import com.example.propertymanagement.model.Invoice;
import com.example.propertymanagement.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getById(@PathVariable UUID id) {
        Optional<Invoice> entity = invoiceRepository.findById(id);
        return entity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Invoice> create(@RequestBody Invoice invoice) {
        Invoice savedEntity = invoiceRepository.save(invoice);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> update(@PathVariable UUID id, @RequestBody Invoice invoice) {
        if (!invoiceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Depending on your entity definitions, you may need a setId() here. 
        // For standard Spring Data JPA, assuming the body contains the correct id or merging works.
        Invoice updatedEntity = invoiceRepository.save(invoice);
        return ResponseEntity.ok(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!invoiceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        invoiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
