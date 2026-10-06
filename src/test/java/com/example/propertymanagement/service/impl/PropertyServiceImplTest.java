package com.example.propertymanagement.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.propertymanagement.dto.PropertyDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PropertyServiceImpl propertyService;

    private UUID propertyId;
    private UUID organizationId;
    private Property property;
    private PropertyDto propertyDto;

    @BeforeEach
    void setUp() {
        propertyId = UUID.randomUUID();
        organizationId = UUID.randomUUID();
        property = new Property();
        property.setPropertyId(propertyId);
        property.setName("Test property");
        propertyDto = new PropertyDto();
        propertyDto.setPropertyId(propertyId);
        propertyDto.setName("Test property");
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createPropertyMapsAndSavesPropertyForStaffUser() {
        User user = authenticatedUser("admin@example.com", "ADMIN", organizationId);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(modelMapper.map(propertyDto, Property.class)).thenReturn(property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        PropertyDto result = propertyService.createProperty(propertyDto);

        assertThat(result).isSameAs(propertyDto);
        assertThat(property.getOrganization()).isSameAs(user.getOrganization());
        verify(propertyRepository).save(property);
    }

    @Test
    void createPropertyDeniesNonStaffUser() {
        User user = authenticatedUser("user@example.com", "USER", null);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> propertyService.createProperty(propertyDto))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getAllPropertysMapsEveryStoredPropertyForPublicAccess() {
        Property secondProperty = new Property();
        PropertyDto secondDto = new PropertyDto();
        when(propertyRepository.findAll()).thenReturn(List.of(property, secondProperty));
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);
        when(modelMapper.map(secondProperty, PropertyDto.class)).thenReturn(secondDto);

        List<PropertyDto> result = propertyService.getAllPropertys();

        assertThat(result).containsExactly(propertyDto, secondDto);
    }

    @Test
    void getAllPropertysReturnsOrganizationScopedDataForStaff() {
        User user = authenticatedUser("manager@example.com", "MANAGER", organizationId);
        when(userRepository.findByEmail("manager@example.com")).thenReturn(Optional.of(user));

        Property secondProperty = new Property();
        PropertyDto secondDto = new PropertyDto();
        when(propertyRepository.findByOrganizationOrganizationId(organizationId)).thenReturn(List.of(property, secondProperty));
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);
        when(modelMapper.map(secondProperty, PropertyDto.class)).thenReturn(secondDto);

        List<PropertyDto> result = propertyService.getAllPropertys();

        assertThat(result).containsExactly(propertyDto, secondDto);
    }

    @Test
    void getPropertyByIdReturnsMappedPropertyForPublicAccess() {
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        assertThat(propertyService.getPropertyById(propertyId)).isSameAs(propertyDto);
    }

    @Test
    void getPropertyByIdThrowsWhenStaffRequestsAnotherOrganizationProperty() {
        User user = authenticatedUser("employee@example.com", "EMPLOYEE", organizationId);
        when(userRepository.findByEmail("employee@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.getPropertyById(propertyId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updatePropertyPreservesPathIdWhenDtoIdIsMissing() {
        User user = authenticatedUser("admin@example.com", "ADMIN", organizationId);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        PropertyDto updateDto = new PropertyDto();
        updateDto.setName("Updated property");
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.of(property));
        doNothing().when(modelMapper).map(updateDto, property);
        when(propertyRepository.save(property)).thenReturn(property);
        when(modelMapper.map(property, PropertyDto.class)).thenReturn(propertyDto);

        PropertyDto result = propertyService.updateProperty(propertyId, updateDto);

        assertThat(property.getPropertyId()).isEqualTo(propertyId);
        assertThat(property.getOrganization()).isSameAs(user.getOrganization());
        assertThat(result).isSameAs(propertyDto);
        verify(modelMapper).map(updateDto, property);
        verify(propertyRepository).save(property);
    }

    @Test
    void updatePropertyThrowsWhenPropertyDoesNotExist() {
        User user = authenticatedUser("admin@example.com", "ADMIN", organizationId);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.updateProperty(propertyId, propertyDto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deletePropertyDeletesExistingProperty() {
        User user = authenticatedUser("admin@example.com", "ADMIN", organizationId);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.of(property));

        propertyService.deleteProperty(propertyId);

        verify(propertyRepository).delete(property);
    }

    @Test
    void deletePropertyThrowsWhenPropertyDoesNotExist() {
        User user = authenticatedUser("admin@example.com", "ADMIN", organizationId);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.deleteProperty(propertyId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private User authenticatedUser(String email, String role, UUID orgId) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, "password", List.of()));

        User user = new User();
        user.setEmail(email);
        user.setRole(role);

        if (orgId != null) {
            Organization organization = new Organization();
            organization.setOrganizationId(orgId);
            user.setOrganization(organization);
        }

        return user;
    }
}
