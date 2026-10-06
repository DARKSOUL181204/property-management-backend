package com.example.propertymanagement.repository;

import com.example.propertymanagement.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID> {
    List<Property> findByOrganizationOrganizationId(UUID organizationId);

    Optional<Property> findByPropertyIdAndOrganizationOrganizationId(UUID propertyId, UUID organizationId);
}
