package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
@Data
public class RentCollectionAnalysisResponse {
    private UUID propertyId;
    private BigDecimal expectedRent;
    private BigDecimal collectedRent;
    private BigDecimal outstandingRent;
    private double collectionRate;
}