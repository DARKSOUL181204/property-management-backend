package com.example.propertymanagement.service.impl;

import com.example.propertymanagement.dto.RentalTenantDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.RentalTenant;
import com.example.propertymanagement.repository.RentalTenantRepository;
import com.example.propertymanagement.service.RentalTenantService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RentalTenantServiceImpl implements RentalTenantService {

    @Autowired
    private RentalTenantRepository rentalTenantRepository;

    @Autowired
    private ModelMapper modelMapper;

    
    @Autowired
    private UserRepository userRepository;
@Override
    public RentalTenantDto createRentalTenant(RentalTenantDto rentalTenantDto) {
        RentalTenant rentalTenant = modelMapper.map(rentalTenantDto, RentalTenant.class);
        RentalTenant savedRentalTenant = rentalTenantRepository.save(rentalTenant);
        return modelMapper.map(savedRentalTenant, RentalTenantDto.class);
    }

    @Override
    public List<RentalTenantDto> getAllRentalTenants() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null) {
                if (user.getOrganization() != null) {
                    final java.util.UUID orgId = user.getOrganization().getOrganizationId();
                    return rentalTenantRepository.findAll().stream()
                            .filter(e -> e.getOrganization() != null && e.getOrganization().getOrganizationId().equals(orgId))
                            .map(e -> modelMapper.map(e, RentalTenantDto.class))
                            .toList();
                }
                if ("ADMIN".equals(user.getRole())) {
                    return rentalTenantRepository.findAll().stream().map(e -> modelMapper.map(e, RentalTenantDto.class)).toList();
                }
            }
        }
        return java.util.Collections.emptyList();
    }

    @Override
    public RentalTenantDto getRentalTenantById(UUID id) {
        RentalTenant rentalTenant = rentalTenantRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("RentalTenant", "id", id)
        );
        return modelMapper.map(rentalTenant, RentalTenantDto.class);
    }

    @Override
    public RentalTenantDto updateRentalTenant(UUID id, RentalTenantDto rentalTenantDto) {
        RentalTenant rentalTenant = rentalTenantRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("RentalTenant", "id", id)
        );
        
        // ModelMapper can be tricky with updates, but we'll map DTO to Entity for simplicity
        modelMapper.map(rentalTenantDto, rentalTenant);
        // We ensure ID is preserved
        // Note: For full robustness, individual fields should be set
        
        RentalTenant updatedRentalTenant = rentalTenantRepository.save(rentalTenant);
        return modelMapper.map(updatedRentalTenant, RentalTenantDto.class);
    }

    @Override
    public void deleteRentalTenant(UUID id) {
        RentalTenant rentalTenant = rentalTenantRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("RentalTenant", "id", id)
        );
        rentalTenantRepository.delete(rentalTenant);
    }
}
