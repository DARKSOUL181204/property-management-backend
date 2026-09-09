package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.MaintenanceRequestDto;
import java.util.List;
import java.util.UUID;

public interface MaintenanceRequestService {
    MaintenanceRequestDto createMaintenanceRequest(MaintenanceRequestDto maintenanceRequestDto);
    List<MaintenanceRequestDto> getAllMaintenanceRequests();
    MaintenanceRequestDto getMaintenanceRequestById(UUID id);
    MaintenanceRequestDto updateMaintenanceRequest(UUID id, MaintenanceRequestDto maintenanceRequestDto);
    void deleteMaintenanceRequest(UUID id);
}
