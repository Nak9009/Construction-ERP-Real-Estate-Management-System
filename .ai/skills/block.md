# Block Skill

## Module Overview
The Block module represents a logical or physical grouping of Lots within a Project (e.g., "Block A", "Phase 1"). It helps organize large developments into manageable sections.

## Responsibilities
- Group Lots logically for phased construction or sales releases.
- Inherit Project-level settings and apply them to child Lots.

## Business Rules
- A Block belongs to one Project.
- A Block's total area is the sum of its child Lots plus common areas (roads, parks) assigned to the block.

## User Roles & Permissions
- **Project Manager**: Create and manage Blocks.
- **Sales Manager**: Can view which Blocks are released for sale.

## Database Entities
- `blocks`
  - `id` (UUID)
  - `project_id` (UUID, FK -> projects)
  - `name` (String, e.g., "Block A")
  - `phase` (String, e.g., "Phase 1")
  - `status` (Enum: planning, active, completed)

## APIs
- `GET /api/v1/projects/{project_id}/blocks`
- `POST /api/v1/projects/{project_id}/blocks`

## UI Pages
- Rendered usually as a sub-view within `ProjectsView` or as a filter in the `LotsView`.

## shadcn/ui Components to Use
- `Tabs` or `Select`: To filter Lots by Block on the UI.

## Backend Architecture
- Simple CRUD. Ensure cascading constraints are handled (e.g., deleting a block should fail if it contains active Lots, using `RESTRICT`).

## Frontend Architecture
- Maintain Block state in the URL query parameters (e.g., `?block=block-uuid`) so users can share links to specific block views.

## Testing Requirements
- Test that a Block cannot be deleted if child Lots exist.
