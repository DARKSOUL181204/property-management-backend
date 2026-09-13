package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.util.UUID;
@Data
public class OccupancyAnalysisResponse {
    private UUID propertyId;
    private int totalUnits;
    private int occupiedUnits;
    private int vacantUnits;
    private double occupancyRate;
}