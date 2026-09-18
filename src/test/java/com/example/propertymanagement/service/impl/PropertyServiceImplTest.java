package com.example.propertymanagement.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.repository.PropertyRepository;

@ExtendWith(MockitoExtension.class)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PropertyServiceImpl propertyService;

    private UUID propertyId;
    private Property property;
    private PropertyDto propertyDto;

    @BeforeEach
    void setUp() {
        propertyId = UUID.randomUUID();
        property = new Property();
        property.setPropertyId(propertyId);
        property.setName("Test property");
        propertyDto = new PropertyDto();
        propertyDto.setPropertyId(propertyId);
        propertyDto.setName("Test property");
    }

    @Test
    void createPropertyMapsAndSavesProperty() {
        when(modelMapper.map(propertyDto, Property.class)).thenReturn(property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        PropertyDto result = propertyService.createProperty(propertyDto);

        assertThat(result).isSameAs(propertyDto);
        verify(propertyRepository).save(property);
    }

    @Test
    void getAllPropertysMapsEveryStoredProperty() {
        Property secondProperty = new Property();
        PropertyDto secondDto = new PropertyDto();
        when(propertyRepository.findAll()).thenReturn(List.of(property, secondProperty));
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);
        when(modelMapper.map(secondProperty, PropertyDto.class)).thenReturn(secondDto);

        List<PropertyDto> result = propertyService.getAllPropertys();

        assertThat(result).containsExactly(propertyDto, secondDto);
    }

    @Test
    void getPropertyByIdReturnsMappedProperty() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        assertThat(propertyService.getPropertyById(propertyId)).isSameAs(propertyDto);
    }

    @Test
    void getPropertyByIdThrowsWhenPropertyDoesNotExist() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.getPropertyById(propertyId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updatePropertyPreservesPathIdWhenDtoIdIsMissing() {
        PropertyDto updateDto = new PropertyDto();
        updateDto.setName("Updated property");
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        doNothing().when(modelMapper).map(updateDto, property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        PropertyDto result = propertyService.updateProperty(propertyId, updateDto);

        assertThat(property.getPropertyId()).isEqualTo(propertyId);
        assertThat(result).isSameAs(propertyDto);
        verify(modelMapper).map(updateDto, property);
        verify(propertyRepository).save(property);
    }

    @Test
    void updatePropertyThrowsWhenPropertyDoesNotExist() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.updateProperty(propertyId, propertyDto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deletePropertyDeletesExistingProperty() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));

        propertyService.deleteProperty(propertyId);

        verify(propertyRepository).delete(property);
    }

    @Test
    void deletePropertyThrowsWhenPropertyDoesNotExist() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.deleteProperty(propertyId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
