package com.example.propertymanagement.service.impl;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PropertyDto createProperty(PropertyDto propertyDto) {
        Property property = modelMapper.map(propertyDto, Property.class);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null && user.getOrganization() != null) {
                property.setOrganization(user.getOrganization());
            }
        }
        
        Property savedProperty = propertyRepository.save(property);
        return modelMapper.map(savedProperty, PropertyDto.class);
    }

    @Override
        public List<PropertyDto> getAllPropertys() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GET ALL PROPERTIES AUTH: " + (auth != null ? auth.getName() : "NULL"));
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null) {
                System.out.println("USER ROLE IS: " + user.getRole() + ", ORG: " + (user.getOrganization() != null ? user.getOrganization().getOrganizationId() : "NULL"));
                if ("MANAGER".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole())) {
                    if (user.getOrganization() != null) {
                        return propertyRepository.findAll().stream()
                                .filter(p -> p.getOrganization() != null && p.getOrganization().getOrganizationId().equals(user.getOrganization().getOrganizationId()))
                                .map(property -> modelMapper.map(property, PropertyDto.class))
                                .toList();
                    }
                    // MANAGER with no org gets empty list (not all properties)
                    return Collections.emptyList();
                }
                if ("ADMIN".equals(user.getRole())) {
                    // Admin sees all
                    return propertyRepository.findAll().stream()
                            .map(property -> modelMapper.map(property, PropertyDto.class))
                            .toList();
                }
                // USER/CUSTOMER role - return empty
                return Collections.emptyList();
            }
        }
        
        List<Property> propertys = propertyRepository.findAll();
        return propertys.stream().map(property -> modelMapper.map(property, PropertyDto.class))
                .toList();
    }

    @Override
    public PropertyDto getPropertyById(UUID id) {
        Property property = propertyRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Property", "id", id)
        );
        return modelMapper.map(property, PropertyDto.class);
    }

    @Override
    public PropertyDto updateProperty(UUID id, PropertyDto propertyDto) {
        Property property = propertyRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Property", "id", id)
        );
        
        // ModelMapper can be tricky with updates, but we'll map DTO to Entity for simplicity
        modelMapper.map(propertyDto, property);
        // We ensure ID is preserved
        property.setPropertyId(id);
        
        Property updatedProperty = propertyRepository.save(property);
        return modelMapper.map(updatedProperty, PropertyDto.class);
    }

    @Override
    public void deleteProperty(UUID id) {
        Property property = propertyRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Property", "id", id)
        );
        propertyRepository.delete(property);
    }
}
