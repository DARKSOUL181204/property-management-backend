# Implementation Plan: Massive Overhaul

I will execute the requested updates:

## 1. UI Fixes
- Fix any layout overlaps in `PropertyCard` and `Employees`. 
- Add a beautiful Footer section to the `PublicPortal` containing the project name "Enclave Property Management", copyright text, and a Dark/Light/System theme toggle button.
- Make the `PublicPortal` aware of the logged-in user. If a Customer is logged in, the top right will show "My Portal" and "Logout" instead of "Login / Register". This will fix the "loophole".

## 2. Deny Reason for Maintenance
- I will modify `MaintenanceRequest.java` and `MaintenanceRequestDto.java` to add a `denyReason` field. 
- In the `Tenants.tsx` dashboard, if an employee selects "Deny" for a request, a text area will prompt them for a reason. This reason will be shown to the tenant in their portal.

## 3. Data Seeding (Multiple Organizations & Property Statuses)
- I will write a massive Python script to inject:
  - 3 different Organizations.
  - Distinct properties assigned to each organization.
  - Realistic diverse property statuses: `FULLY_OCCUPIED`, `PARTIALLY_OCCUPIED`, `NEW_PROJECT`, `UNDER_CONSTRUCTION`.
