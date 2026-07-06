# Workforce Skill

## Module Overview
The Workforce module manages internal employees, external contractors, and daily labor allocation across different projects and construction sites.

## Responsibilities
- Maintain the employee directory (roles, contact info, basic HR data).
- Manage external contractor profiles and compliance documents (insurance, licenses).
- Track daily labor attendance and allocation to specific projects.

## Business Rules
- A contractor cannot be assigned to a project if their compliance documents (e.g., liability insurance) are expired.
- Daily attendance must be logged before generating payroll or contractor payout reports.

## User Roles & Permissions
- **HR Admin**: Manages employee profiles and salaries.
- **Site Supervisor**: Logs daily attendance for their specific site.
- **Compliance Officer**: Verifies contractor documents.

## Database Entities
- `employees`
  - `id` (UUID)
  - `user_id` (UUID, FK -> users)
  - `department` (String)
  - `hourly_rate` (Integer, Cents)
- `contractors`
  - `id` (UUID)
  - `company_name` (String)
  - `trade` (String, e.g., 'Plumbing')
  - `compliance_status` (Enum: valid, expired, pending)
- `labor_logs`
  - `id` (UUID)
  - `project_id` (UUID)
  - `worker_type` (Enum: employee, contractor)
  - `worker_id` (UUID)
  - `hours_worked` (Decimal)
  - `date` (Date)

## APIs
- `GET /api/v1/workforce/employees`
- `GET /api/v1/workforce/contractors`
- `POST /api/v1/workforce/labor-logs`

## UI Pages
- **`/workforce/directory`**: Employee and Contractor list.
- **`/workforce/attendance`**: Daily timesheet entry view.

## shadcn/ui Components to Use
- `Avatar`: For employee profile pictures.
- `Data Table`: For the directory, supporting filtering by trade/department.
- `Tabs`: To separate Internal Employees from External Contractors.

## Backend Architecture
- Creating a `LaborLog` should dispatch an event that the Finance/Costing module listens to in order to update the real-time cost of a project.

## Frontend Architecture
- The timesheet entry view should use a spreadsheet-like grid for fast data entry by supervisors, utilizing `react-hook-form` arrays.

## Testing Requirements
- Verify that attempting to assign an expired contractor to a project returns a 422 Unprocessable Entity error.
