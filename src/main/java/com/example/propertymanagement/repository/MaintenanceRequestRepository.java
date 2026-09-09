package com.example.propertymanagement.repository;

import com.example.propertymanagement.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, UUID> {
}
