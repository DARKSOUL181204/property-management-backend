package com.example.propertymanagement.service;

import com.example.propertymanagement.dto.PublicListingDto;
import java.util.List;
import java.util.UUID;

public interface PublicListingService {
    PublicListingDto createPublicListing(PublicListingDto publicListingDto);
    List<PublicListingDto> getAllPublicListings();
    PublicListingDto getPublicListingById(UUID id);
    PublicListingDto updatePublicListing(UUID id, PublicListingDto publicListingDto);
    void deletePublicListing(UUID id);
}
