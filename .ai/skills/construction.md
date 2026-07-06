# Construction Skill

## Module Overview
The Construction module manages the daily operational execution of building a House or Project infrastructure. It tracks daily logs, site issues, and overall physical progress.

## Responsibilities
- Record Daily Site Reports (weather, workers on site, materials delivered).
- Log and track construction issues/defects (Snags).
- Provide data to update the overall Timeline.

## Business Rules
- Daily Logs must be submitted on the day of work. Backdating requires managerial approval.
- An issue/snag must be assigned to a specific Contractor or Employee for resolution.

## User Roles & Permissions
- **Site Supervisor**: Can submit daily logs and raise snags.
- **Project Manager**: Reviews logs, assigns snag resolutions.
- **Contractor**: Can view snags assigned to them (if granted portal access).

## Database Entities
- `daily_logs`
  - `id` (UUID)
  - `project_id` (UUID)
  - `house_id` (UUID, Nullable)
  - `date` (Date)
  - `weather` (String)
  - `notes` (Text)
  - `supervisor_id` (UUID)
- `snags` (Issues)
  - `id` (UUID)
  - `related_entity_type` (String, e.g., 'house', 'project')
  - `related_entity_id` (UUID)
  - `description` (Text)
  - `severity` (Enum: low, medium, high)
  - `status` (Enum: open, in_progress, resolved)

## APIs
- `GET /api/v1/projects/{project_id}/daily-logs`
- `POST /api/v1/projects/{project_id}/daily-logs`
- `POST /api/v1/snags`

## UI Pages
- **`/construction/logs`**: Calendar or list view of daily logs.
- **`/construction/snags`**: Issue tracker / Kanban board for defects.

## shadcn/ui Components to Use
- `Calendar`: For selecting dates for logs.
- `Textarea`: For detailed snag descriptions.
- `Select`: For assigning snags to workers.

## Backend Architecture
- Creating a `DailyLog` might trigger material deductions if the log details material consumption. This should happen via Domain Events handled by the Warehouse module.

## Frontend Architecture
- The Snag board should be highly interactive (drag-and-drop status changes). Consider `dnd-kit` integrated with standard shadcn Cards.

## Testing Requirements
- Test that daily logs cannot be submitted for future dates.
