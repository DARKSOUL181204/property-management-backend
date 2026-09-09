package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.PropertyDto;
import java.util.List;
import java.util.UUID;

public interface PropertyService {
    PropertyDto createProperty(PropertyDto propertyDto);
    List<PropertyDto> getAllPropertys();
    PropertyDto getPropertyById(UUID id);
    PropertyDto updateProperty(UUID id, PropertyDto propertyDto);
    void deleteProperty(UUID id);
}
