# Branch Skill

## Module Overview
The Branch module manages physical office locations or regional subsidiaries of the company. It serves as an isolation boundary for employees, inventory, and local finances.

## Responsibilities
- Manage physical addresses and contact information for branches.
- Assign employees to specific branches.
- Scope financial reporting and inventory to branch levels.

## Business Rules
- A branch must have at least one designated Branch Manager.
- Assets (equipment, inventory) are assigned to a specific branch and cannot be moved without a Transfer Order.

## User Roles & Permissions
- **Admin**: Can create and delete branches.
- **Branch Manager**: Can edit branch contact details, view all branch-level reports.
- **Employee**: Can view their assigned branch details.

## Database Entities
- `branches`
  - `id` (UUID)
  - `name` (String)
  - `code` (String, Unique)
  - `address` (Text)
  - `manager_id` (UUID, FK -> users)
  - `is_active` (Boolean)

## APIs
- `GET /api/v1/branches`
- `POST /api/v1/branches`
- `GET /api/v1/branches/{id}`
- `PUT /api/v1/branches/{id}`

## UI Pages
- **`/branches`**: List of all branches (Data Table).
- **`/branches/{id}`**: Detailed view of a branch, its employees, and active projects.

## shadcn/ui Components to Use
- `Data Table`: For listing branches.
- `Sheet`: For creating/editing a branch to keep the user in the context of the list.
- `Tabs`: In the branch detail view (Overview, Employees, Inventory).

## Backend Architecture
- Ensure Global Scopes are applied if a user is restricted to a specific branch. Example: `BranchScope` automatically adds `where('branch_id', auth()->user()->branch_id)` to queries.

## Frontend Architecture
- The current selected branch context should be visible in the `TopNav` (using a `Select` component) if the user has access to multiple branches.

## Testing Requirements
- Test that a user restricted to Branch A cannot fetch data for Branch B via API.
