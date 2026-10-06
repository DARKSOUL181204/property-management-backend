package com.example.propertymanagement.service.impl;

import com.example.propertymanagement.dto.ExpenseDto;
import com.example.propertymanagement.exception.ResourceNotFoundException;
import com.example.propertymanagement.model.Expense;
import com.example.propertymanagement.model.Organization;
import com.example.propertymanagement.model.Property;
import com.example.propertymanagement.model.User;
import com.example.propertymanagement.repository.ExpenseRepository;
import com.example.propertymanagement.repository.PropertyRepository;
import com.example.propertymanagement.repository.UserRepository;
import com.example.propertymanagement.service.ExpenseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);
        Property property = getAuthorizedProperty(expenseDto.getPropertyPropertyId(), organization.getOrganizationId());

        Expense expense = new Expense();
        expense.setCategory(expenseDto.getCategory());
        expense.setAmount(expenseDto.getAmount());
        expense.setExpenseDate(expenseDto.getExpenseDate());
        expense.setOrganization(organization);
        expense.setProperty(property);

        Expense savedExpense = expenseRepository.save(expense);
        return modelMapper.map(savedExpense, ExpenseDto.class);
    }

    @Override
    public List<ExpenseDto> getAllExpenses() {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        List<Expense> expenses = expenseRepository.findByOrganizationOrganizationId(organization.getOrganizationId());
        return expenses.stream().map(expense -> modelMapper.map(expense, ExpenseDto.class))
                .toList();
    }

    @Override
    public ExpenseDto getExpenseById(UUID id) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        Expense expense = expenseRepository.findByExpenseIdAndOrganizationOrganizationId(id, organization.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        return modelMapper.map(expense, ExpenseDto.class);
    }

    @Override
    public ExpenseDto updateExpense(UUID id, ExpenseDto expenseDto) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        Expense expense = expenseRepository.findByExpenseIdAndOrganizationOrganizationId(id, organization.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        expense.setCategory(expenseDto.getCategory());
        expense.setAmount(expenseDto.getAmount());
        expense.setExpenseDate(expenseDto.getExpenseDate());

        UUID propertyId = expenseDto.getPropertyPropertyId();
        if (propertyId != null) {
            Property property = getAuthorizedProperty(propertyId, organization.getOrganizationId());
            expense.setProperty(property);
        }
        expense.setOrganization(organization);

        Expense updatedExpense = expenseRepository.save(expense);
        return modelMapper.map(updatedExpense, ExpenseDto.class);
    }

    @Override
    public void deleteExpense(UUID id) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        Expense expense = expenseRepository.findByExpenseIdAndOrganizationOrganizationId(id, organization.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        expenseRepository.delete(expense);
    }

    @Override
    public List<ExpenseDto> getExpensesByPropertyId(UUID propertyId) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        getAuthorizedProperty(propertyId, organization.getOrganizationId());
        return expenseRepository.findByPropertyPropertyIdAndOrganizationOrganizationId(propertyId, organization.getOrganizationId()).stream()
                .map(expense -> modelMapper.map(expense, ExpenseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAllExpensesByPropertyId(UUID propertyId) {
        User currentUser = getCurrentStaffUser();
        Organization organization = requireOrganization(currentUser);

        getAuthorizedProperty(propertyId, organization.getOrganizationId());
        List<Expense> expenses = expenseRepository.findByPropertyPropertyIdAndOrganizationOrganizationId(propertyId, organization.getOrganizationId());
        expenseRepository.deleteAll(expenses);
    }

    private User getCurrentStaffUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new AccessDeniedException("Authentication required");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));

        if (!isStaffRole(user)) {
            throw new AccessDeniedException("You are not authorized to manage expenses");
        }
        return user;
    }

    private boolean isStaffRole(User user) {
        return user != null && ("ADMIN".equals(user.getRole()) || "MANAGER".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole()));
    }

    private Organization requireOrganization(User user) {
        Organization organization = user.getOrganization();
        if (organization == null) {
            throw new AccessDeniedException("No organization assigned to user");
        }
        return organization;
    }

    private Property getAuthorizedProperty(UUID propertyId, UUID organizationId) {
        if (propertyId == null) {
            throw new ResourceNotFoundException("Property", "id", null);
        }
        return propertyRepository.findByPropertyIdAndOrganizationOrganizationId(propertyId, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
    }
}
