package com.example.propertymanagement.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        User currentUser = getCurrentUserOrThrow();
        ensureStaffRole(currentUser);
        Organization organization = requireOrganization(currentUser);

        Property property = modelMapper.map(propertyDto, Property.class);
        property.setOrganization(organization);
        Property savedProperty = propertyRepository.save(property);
        return modelMapper.map(savedProperty, PropertyDto.class);
    }

    @Override
    public List<PropertyDto> getAllPropertys() {
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isPresent() && isStaffRole(currentUser.get())) {
            Organization organization = currentUser.get().getOrganization();
            if (organization == null) {
                return List.of();
            }
            return propertyRepository.findByOrganizationOrganizationId(organization.getOrganizationId()).stream()
                    .map(property -> modelMapper.map(property, PropertyDto.class))
                    .toList();
        }

        List<Property> propertys = propertyRepository.findAll();
        return propertys.stream().map(property -> modelMapper.map(property, PropertyDto.class))
                .toList();
    }

    @Override
    public PropertyDto getPropertyById(UUID id) {
        Property property = findAccessiblePropertyById(id);
        return modelMapper.map(property, PropertyDto.class);
    }

    @Override
    public PropertyDto updateProperty(UUID id, PropertyDto propertyDto) {
        User currentUser = getCurrentUserOrThrow();
        ensureStaffRole(currentUser);
        Organization organization = requireOrganization(currentUser);

        Property property = propertyRepository.findByPropertyIdAndOrganizationOrganizationId(id, organization.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        modelMapper.map(propertyDto, property);
        property.setPropertyId(id);
        property.setOrganization(organization);

        Property updatedProperty = propertyRepository.save(property);
        return modelMapper.map(updatedProperty, PropertyDto.class);
    }

    @Override
    public void deleteProperty(UUID id) {
        User currentUser = getCurrentUserOrThrow();
        ensureStaffRole(currentUser);
        Organization organization = requireOrganization(currentUser);

        Property property = propertyRepository.findByPropertyIdAndOrganizationOrganizationId(id, organization.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        propertyRepository.delete(property);
    }

    private Property findAccessiblePropertyById(UUID propertyId) {
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isPresent() && isStaffRole(currentUser.get())) {
            Organization organization = currentUser.get().getOrganization();
            if (organization == null) {
                throw new ResourceNotFoundException("Property", "id", propertyId);
            }
            return propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organization.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
        }
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
    }

    private Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return Optional.empty();
        }
        return userRepository.findByEmail(authentication.getName());
    }

    private User getCurrentUserOrThrow() {
        return getCurrentUser().orElseThrow(() -> new AccessDeniedException("Authentication required"));
    }

    private void ensureStaffRole(User user) {
        if (!isStaffRole(user)) {
            throw new AccessDeniedException("You are not authorized to manage properties");
        }
    }

    private boolean isStaffRole(User user) {
        return user != null && ("ADMIN".equals(user.getRole()) || "MANAGER".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole()));
    }

    private Organization requireOrganization(User user) {
        if (user.getOrganization() == null) {
            throw new AccessDeniedException("No organization assigned to user");
        }
        return user.getOrganization();
    }
}
