# Permissions Skill

## Module Overview
The Permissions module governs the Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) systems, ensuring users can only access and mutate data they are authorized to interact with.

## Responsibilities
- Define hierarchical user roles (SuperAdmin, Manager, Agent, etc.).
- Define granular permissions (e.g., `create_projects`, `delete_invoices`).
- Assign roles to users and resolve their effective permissions.

## Business Rules
- "SuperAdmin" role implicitly bypasses all permission checks.
- Permissions are additive. If a user belongs to multiple roles, they gain the union of all permissions.

## User Roles & Permissions
- **SuperAdmin**: Can create new Roles and assign Permissions.
- **HR/Manager**: Can assign existing Roles to Employees.

## Database Entities
- (Assuming the use of Spatie Laravel-Permission or a similar standard library)
- `roles`
  - `id` (Integer/UUID)
  - `name` (String)
- `permissions`
  - `id` (Integer/UUID)
  - `name` (String)
- `role_has_permissions` (Pivot)
- `model_has_roles` (Pivot)

## APIs
- `GET /api/v1/roles`
- `POST /api/v1/roles/{id}/permissions`
- `POST /api/v1/users/{id}/roles`

## UI Pages
- **`/settings/permissions`**: Matrix view linking Roles (columns) to Permissions (rows) via toggles.

## shadcn/ui Components to Use
- `Table` / `Data Table`: For the complex Permission Matrix.
- `Switch`: For toggling individual permissions on and off for a role.

## Backend Architecture
- **Gates & Policies**: All authorization checks must happen in Laravel Policies or via the `Gate` facade.
- **Middleware**: Use role/permission middleware on API routes to block unauthorized access before the controller is even instantiated (e.g., `middleware(['permission:edit_invoices'])`).
- **Caching**: Permission resolution is expensive. Rely on Spatie's built-in caching or implement a Redis cache for user permission arrays, invalidating it when roles change.

## Frontend Architecture
- The Next.js frontend must request the current user's effective permissions upon login.
- Store this array in the Zustand global state.
- Create a `<Can>` wrapper component to conditionally render UI elements (e.g., hiding the "Delete" button if the user lacks the `delete_project` permission).

## Testing Requirements
- Unit/Feature Tests: Ensure endpoints return a 403 Forbidden status when accessed by a user without the requisite permission.
