import re

# 1. Fix MaintenanceRequestServiceImpl
with open('src/main/java/com/example/propertymanagement/service/impl/MaintenanceRequestServiceImpl.java', 'r') as f:
    content = f.read()
target = """    public List<MaintenanceRequestDto> getAllMaintenanceRequests() {
        List<MaintenanceRequest> maintenanceRequests = maintenanceRequestRepository.findAll();
        return maintenanceRequests.stream().map(maintenanceRequest -> modelMapper.map(maintenanceRequest, MaintenanceRequestDto.class))
                .toList();
    }"""
replacement = """    public List<MaintenanceRequestDto> getAllMaintenanceRequests() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null && ("MANAGER".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole())) && user.getOrganization() != null) {
                return maintenanceRequestRepository.findAll().stream()
                        .filter(m -> m.getOrganization() != null && m.getOrganization().getOrganizationId().equals(user.getOrganization().getOrganizationId()))
                        .map(m -> modelMapper.map(m, MaintenanceRequestDto.class))
                        .toList();
            }
        }
        return maintenanceRequestRepository.findAll().stream().map(m -> modelMapper.map(m, MaintenanceRequestDto.class)).toList();
    }"""
# Need to make sure User and userRepository are available. 
# Wait, does MaintenanceRequestServiceImpl have userRepository?
