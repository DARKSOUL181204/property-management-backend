package com.example.propertymanagement.repository;

import com.example.propertymanagement.model.LeadInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LeadInquiryRepository extends JpaRepository<LeadInquiry, UUID> {
}
