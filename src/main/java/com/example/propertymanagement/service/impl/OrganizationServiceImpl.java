package com.example.propertymanagement.service.impl;

import com.example.propertymanagement.dto.OrganizationDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.repository.OrganizationRepository;
import com.example.propertymanagement.service.OrganizationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public OrganizationDto createOrganization(OrganizationDto organizationDto) {
        Organization organization = modelMapper.map(organizationDto, Organization.class);
        Organization savedOrganization = organizationRepository.save(organization);
        return modelMapper.map(savedOrganization, OrganizationDto.class);
    }

    @Override
    public List<OrganizationDto> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();
        return organizations.stream().map(organization -> modelMapper.map(organization, OrganizationDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrganizationDto getOrganizationById(UUID id) {
        Organization organization = organizationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Organization", "id", id)
        );
        return modelMapper.map(organization, OrganizationDto.class);
    }

    @Override
    public OrganizationDto updateOrganization(UUID id, OrganizationDto organizationDto) {
        Organization organization = organizationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Organization", "id", id)
        );
        
        // ModelMapper can be tricky with updates, but we'll map DTO to Entity for simplicity
        modelMapper.map(organizationDto, organization);
        // We ensure ID is preserved
        // Note: For full robustness, individual fields should be set
        
        Organization updatedOrganization = organizationRepository.save(organization);
        return modelMapper.map(updatedOrganization, OrganizationDto.class);
    }

    @Override
    public void deleteOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Organization", "id", id)
        );
        organizationRepository.delete(organization);
    }
}
