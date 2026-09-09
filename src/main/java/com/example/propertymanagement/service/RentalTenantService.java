package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.RentalTenantDto;
import java.util.List;
import java.util.UUID;

public interface RentalTenantService {
    RentalTenantDto createRentalTenant(RentalTenantDto rentalTenantDto);
    List<RentalTenantDto> getAllRentalTenants();
    RentalTenantDto getRentalTenantById(UUID id);
    RentalTenantDto updateRentalTenant(UUID id, RentalTenantDto rentalTenantDto);
    void deleteRentalTenant(UUID id);
}
