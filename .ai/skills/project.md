# Project Skill

## Module Overview
The Project module is the core operational entity representing a distinct construction development (e.g., "Sunrise Valley Estate"). It ties together Land, Blocks, Houses, Budgets, and Timelines.

## Responsibilities
- Define project scope, name, and total estimated budget.
- Track overall project status (Planning, In Progress, Completed, Suspended).
- Aggregate costs and revenue from child entities (Houses, Sales).

## Business Rules
- A project cannot be marked as "Completed" if there are active construction phases or unsold inventory.
- Budgets can only be adjusted via a formal Change Order process once the project is "In Progress".

## User Roles & Permissions
- **Project Manager**: Full read/write access to their assigned projects.
- **Executive**: Read-only access to all projects and financial aggregates.
- **Site Supervisor**: Read access to assigned projects, write access to daily logs.

## Database Entities
- `projects`
  - `id` (UUID)
  - `branch_id` (UUID, FK -> branches)
  - `name` (String)
  - `status` (Enum: planning, in_progress, completed, suspended)
  - `start_date` (Date)
  - `end_date` (Date, Nullable)
  - `budget_allocated` (BigInteger, Cents)

## APIs
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{id}`
- `PATCH /api/v1/projects/{id}/status`

## UI Pages
- **`/projects`**: Kanban board or Data Table of active projects.
- **`/projects/{id}`**: Comprehensive dashboard for a single project (Progress bars, Financial summary, Map view).

## shadcn/ui Components to Use
- `Card`: For project summaries.
- `Badge`: For standardizing Project Statuses (Planning=Yellow, In Progress=Blue, Completed=Green).
- `Progress`: To visually represent completion percentage.

## Backend Architecture
- **ProjectContext**: Houses the `CreateProjectAction`, `ChangeProjectStatusAction`.
- Use Model Observers to recalculate project completion percentages when child tasks (Timeline module) are updated.

## Frontend Architecture
- Cache the single project data heavily in TanStack Query, as it serves as the root context for many sub-views (Blocks, Lots, Houses).

## Testing Requirements
- Assert that changing a project status to 'completed' fails if child entities (e.g., houses) are still under construction.
