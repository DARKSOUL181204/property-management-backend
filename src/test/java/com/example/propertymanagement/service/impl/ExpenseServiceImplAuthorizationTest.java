package com.example.propertymanagement.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import com.example.propertymanagement.dto.ExpenseDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Expense;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.ExpenseRepository;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceImplAuthorizationTest {

    @Mock
    private ExpenseRepository expenseRepository;
    @Mock
    private ModelMapper modelMapper;
    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private UUID organizationId;
    private UUID propertyId;

    @BeforeEach
    void setUp() {
        organizationId = UUID.randomUUID();
        propertyId = UUID.randomUUID();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAllExpensesDeniesCustomerRole() {
        User user = authenticatedUser("customer@example.com", "USER", organizationId);
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> expenseService.getAllExpenses())
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void createExpenseRejectsUnauthorizedProperty() {
        User user = authenticatedUser("manager@example.com", "MANAGER", organizationId);
        when(userRepository.findByEmail("manager@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.empty());

        ExpenseDto dto = new ExpenseDto();
        dto.setPropertyPropertyId(propertyId);
        dto.setCategory("MAINTENANCE");
        dto.setAmount(BigDecimal.TEN);
        dto.setExpenseDate(LocalDate.now());

        assertThatThrownBy(() -> expenseService.createExpense(dto))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createExpenseUsesAuthenticatedOrganizationContext() {
        User user = authenticatedUser("employee@example.com", "EMPLOYEE", organizationId);
        when(userRepository.findByEmail("employee@example.com")).thenReturn(Optional.of(user));

        Property property = new Property();
        property.setPropertyId(propertyId);
        when(propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)).thenReturn(Optional.of(property));

        ExpenseDto dto = new ExpenseDto();
        dto.setPropertyPropertyId(propertyId);
        dto.setOrganizationOrganizationId(UUID.randomUUID());
        dto.setCategory("UTILITY");
        dto.setAmount(BigDecimal.valueOf(2500));
        dto.setExpenseDate(LocalDate.now());

        Expense savedExpense = new Expense();
        savedExpense.setProperty(property);
        savedExpense.setOrganization(user.getOrganization());
        when(expenseRepository.save(any(Expense.class))).thenReturn(savedExpense);

        ExpenseDto mapped = new ExpenseDto();
        mapped.setPropertyPropertyId(propertyId);
        mapped.setOrganizationOrganizationId(organizationId);
        when(modelMapper.map(savedExpense, ExpenseDto.class)).thenReturn(mapped);

        ExpenseDto result = expenseService.createExpense(dto);

        assertThat(result.getPropertyPropertyId()).isEqualTo(propertyId);
        assertThat(result.getOrganizationOrganizationId()).isEqualTo(organizationId);
        verify(expenseRepository).save(any(Expense.class));
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
