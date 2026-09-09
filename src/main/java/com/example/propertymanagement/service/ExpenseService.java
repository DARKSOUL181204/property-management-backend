package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.ExpenseDto;
import java.util.List;
import java.util.UUID;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);
    List<ExpenseDto> getAllExpenses();
    ExpenseDto getExpenseById(UUID id);
    ExpenseDto updateExpense(UUID id, ExpenseDto expenseDto);
    void deleteExpense(UUID id);
}
