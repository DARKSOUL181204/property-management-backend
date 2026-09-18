package com.example.propertymanagement.service.impl;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PropertyDto createProperty(PropertyDto propertyDto) {
        Property property = modelMapper.map(propertyDto, Property.class);
        Property savedProperty = propertyRepository.save(property);
        return modelMapper.map(savedProperty, PropertyDto.class);
    }

    @Override
    public List<PropertyDto> getAllPropertys() {
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
