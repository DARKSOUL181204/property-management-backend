package com.example.propertymanagement.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.payload.response.analytics.OccupancyAnalysisResponse;
import com.example.propertymanagement.repository.ExpenseRepository;
import com.example.propertymanagement.repository.InvoiceRepository;
import com.example.propertymanagement.repository.LeaseRepository;
import com.example.propertymanagement.repository.MaintenanceRequestRepository;
import com.example.propertymanagement.repository.PaymentRepository;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.repository.UnitRepository;
import com.example.propertymanagement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplAuthorizationTest {

    @Mock
    private UnitRepository unitRepository;
    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private ExpenseRepository expenseRepository;
    @Mock
    private MaintenanceRequestRepository maintenanceRepository;
    @Mock
    private LeaseRepository leaseRepository;
    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    private UUID propertyId;
    private UUID organizationId;

    @BeforeEach
    void setUp() {
        propertyId = UUID.randomUUID();
        organizationId = UUID.randomUUID();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getPropertyPerformanceDeniesCustomerRole() {
        User user = authenticatedUser("customer@example.com", "USER", organizationId);
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> analyticsService.getPropertyPerformance(propertyId))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getPropertyPerformanceRejectsCrossOrganizationProperty() {
        User user = authenticatedUser("manager@example.com", "MANAGER", organizationId);
        when(userRepository.findByEmail("manager@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> analyticsService.getPropertyPerformance(propertyId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getOccupancyAnalysisReturnsSafeEmptyResponseWhenNoUnitsExist() {
        User user = authenticatedUser("employee@example.com", "EMPLOYEE", organizationId);
        when(userRepository.findByEmail("employee@example.com")).thenReturn(Optional.of(user));

        Property property = new Property();
        property.setPropertyId(propertyId);
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.of(property));
        when(unitRepository.findByPropertyPropertyId(propertyId)).thenReturn(List.of());

        OccupancyAnalysisResponse response = analyticsService.getOccupancyAnalysis(propertyId);

        assertThat(response.getPropertyId()).isEqualTo(propertyId);
        assertThat(response.getTotalUnits()).isZero();
        assertThat(response.getOccupiedUnits()).isZero();
        assertThat(response.getVacantUnits()).isZero();
        assertThat(response.getOccupancyRate()).isEqualTo(0.0);
    }

    private User authenticatedUser(String email, String role, UUID orgId) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, "password", List.of()));

        User user = new User();
        user.setEmail(email);
        user.setRole(role);

        Organization organization = new Organization();
        organization.setOrganizationId(orgId);
        user.setOrganization(organization);

        return user;
    }
}
