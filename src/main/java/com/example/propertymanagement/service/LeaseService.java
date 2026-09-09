package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.LeaseDto;
import java.util.List;
import java.util.UUID;

public interface LeaseService {
    LeaseDto createLease(LeaseDto leaseDto);
    List<LeaseDto> getAllLeases();
    LeaseDto getLeaseById(UUID id);
    LeaseDto updateLease(UUID id, LeaseDto leaseDto);
    void deleteLease(UUID id);
}
