package com.example.propertymanagement.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ExpenseDto {
    private UUID id;
    // Basic mapping, we'll use ModelMapper to handle the rest automatically
    // It's recommended to explicitly list fields here to avoid exposing internal entity structure completely
}
