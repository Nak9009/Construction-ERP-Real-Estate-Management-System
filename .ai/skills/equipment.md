# Equipment Skill

## Module Overview
The Equipment module tracks company-owned and rented machinery (e.g., excavators, cranes). It manages maintenance schedules, assignments to projects, and depreciation/rental costs.

## Responsibilities
- Maintain an inventory of all heavy machinery and tools.
- Track which project currently has the equipment.
- Schedule and log preventative maintenance to prevent breakdowns.

## Business Rules
- Equipment cannot be assigned to two different projects on the same date.
- Equipment marked "Under Maintenance" cannot be assigned to a project.

## User Roles & Permissions
- **Fleet/Equipment Manager**: Manages the inventory, schedules maintenance.
- **Project Manager**: Requests equipment for their project.

## Database Entities
- `equipment`
  - `id` (UUID)
  - `name` (String)
  - `type` (Enum: owned, rented)
  - `status` (Enum: available, deployed, maintenance, retired)
  - `daily_cost` (Integer, Cents)
- `equipment_assignments`
  - `equipment_id` (UUID)
  - `project_id` (UUID)
  - `start_date` (Date)
  - `end_date` (Date, Nullable)
- `maintenance_logs`
  - `equipment_id` (UUID)
  - `date` (Date)
  - `cost` (Integer)
  - `notes` (Text)

## APIs
- `GET /api/v1/equipment`
- `POST /api/v1/equipment/assign`
- `POST /api/v1/equipment/{id}/maintenance`

## UI Pages
- **`/equipment`**: Dashboard showing equipment status (Available vs Deployed).
- **`/equipment/{id}`**: Detail view showing location history and maintenance logs.

## shadcn/ui Components to Use
- `Badge`: For status (`available`=green, `deployed`=blue, `maintenance`=yellow).
- `Calendar`: To visualize when equipment is booked for different projects.

## Backend Architecture
- Calculate utilization rates (Days Deployed / Total Days) via background Jobs and cache the results for the dashboard.
- Generate costs for projects automatically via a daily cron job that reads active `equipment_assignments`.

## Frontend Architecture
- The booking interface should prevent double-booking visually by disabling dates on a `Calendar` component if the equipment is already assigned.

## Testing Requirements
- Date overlap validation: Ensure the API rejects an assignment if the `start_date` and `end_date` overlap with an existing assignment for the same equipment.
