package com.example.propertymanagement.payload.response.analytics;
import lombok.Data;
import java.util.UUID;
@Data
public class MaintenanceAnalysisResponse {
    private UUID propertyId;
    private int totalRequests;
    private int openRequests;
    private int inProgressRequests;
    private int resolvedRequests;
}