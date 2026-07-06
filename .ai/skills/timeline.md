# Timeline Skill

## Module Overview
The Timeline module acts as the scheduling engine (Gantt chart equivalent) for Projects and Houses. It manages tasks, dependencies, and critical paths.

## Responsibilities
- Break down construction into hierarchical Tasks (Phases -> Tasks -> Sub-tasks).
- Track planned vs. actual start and end dates.
- Manage dependencies (Task B cannot start until Task A finishes).

## Business Rules
- If a predecessor task is delayed, successor tasks should optionally auto-shift their planned dates.
- A Task is considered "Complete" only when its progress reaches 100%.

## User Roles & Permissions
- **Project Manager**: Creates and edits the timeline, sets baselines.
- **Site Supervisor**: Updates task progress percentages.

## Database Entities
- `tasks`
  - `id` (UUID)
  - `project_id` (UUID)
  - `house_id` (UUID, Nullable)
  - `parent_id` (UUID, Nullable for sub-tasks)
  - `name` (String)
  - `planned_start` (Date)
  - `planned_end` (Date)
  - `actual_start` (Date, Nullable)
  - `actual_end` (Date, Nullable)
  - `progress_percent` (Integer, 0-100)
- `task_dependencies`
  - `predecessor_id` (UUID)
  - `successor_id` (UUID)
  - `type` (Enum: finish_to_start, start_to_start)

## APIs
- `GET /api/v1/projects/{project_id}/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/{id}/progress`

## UI Pages
- **`/timeline/{project_id}`**: A Gantt chart and task list.

## shadcn/ui Components to Use
- `Data Table` (with expandable rows for child tasks).
- `Progress`: For visualizing task completion.
- `Popover`: For quick-editing task dates on a calendar.

## Backend Architecture
- **Dependency Calculation**: The logic for shifting successor tasks when a predecessor is delayed should be encapsulated in a dedicated Domain Service (e.g., `RecalculateTimelineService`).
- Use recursive CTEs (Common Table Expressions) in MySQL if deep fetching of task hierarchies is required.

## Frontend Architecture
- A robust Gantt chart component is required. If building from scratch, use a virtualized list to handle hundreds of tasks without performance degradation.

## Testing Requirements
- E2E Test: Delaying a critical path task by 5 days automatically shifts dependent tasks by 5 days.
