package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.OrganizationDto;
import java.util.List;
import java.util.UUID;

public interface OrganizationService {
    OrganizationDto createOrganization(OrganizationDto organizationDto);
    List<OrganizationDto> getAllOrganizations();
    OrganizationDto getOrganizationById(UUID id);
    OrganizationDto updateOrganization(UUID id, OrganizationDto organizationDto);
    void deleteOrganization(UUID id);
}
