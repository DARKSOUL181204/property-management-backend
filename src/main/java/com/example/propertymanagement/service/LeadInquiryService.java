package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.LeadInquiryDto;
import java.util.List;
import java.util.UUID;

public interface LeadInquiryService {
    LeadInquiryDto createLeadInquiry(LeadInquiryDto leadInquiryDto);
    List<LeadInquiryDto> getAllLeadInquirys();
    LeadInquiryDto getLeadInquiryById(UUID id);
    LeadInquiryDto updateLeadInquiry(UUID id, LeadInquiryDto leadInquiryDto);
    void deleteLeadInquiry(UUID id);
}
