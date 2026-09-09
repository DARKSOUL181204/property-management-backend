package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.UnitDto;
import java.util.List;
import java.util.UUID;

public interface UnitService {
    UnitDto createUnit(UnitDto unitDto);
    List<UnitDto> getAllUnits();
    UnitDto getUnitById(UUID id);
    UnitDto updateUnit(UUID id, UnitDto unitDto);
    void deleteUnit(UUID id);
}
