# Dashboard Skill

## Module Overview
The Dashboard is the central hub for users to get a bird's-eye view of the entire ERP system. It aggregates key performance indicators (KPIs), urgent tasks, and operational alerts tailored to the user's role.

## Responsibilities
- Aggregate and present high-level metrics (Sales, Construction Progress, Financials).
- Provide quick links to frequently used modules.
- Display urgent notifications and pending approvals.

## Business Rules
- Data displayed must be scoped to the user's permissions and assigned branches/projects.
- Financial data is restricted to users with Executive or Finance roles.

## User Roles & Permissions
- **Admin/Executive**: Full view of all KPIs (Company-wide).
- **Project Manager**: Sees metrics restricted to their assigned projects.
- **Sales Agent**: Sees lead conversions, active contracts, and personal targets.

## Database Entities
- No distinct entities. The dashboard primarily queries aggregated views or cached statistics from other modules.

## APIs
- `GET /api/v1/dashboard/metrics`
- `GET /api/v1/dashboard/activities`

## UI Pages
- **`/` (Home)**: The main dashboard view.

## shadcn/ui Components to Use
- `Card`: For KPI widgets.
- `Skeleton`: For loading states of asynchronous charts.
- `Tabs`: To switch between different metric categories (e.g., Sales vs Construction).
- Recharts (wrapped in Card): For visual data representation.

## Backend Architecture
- **MetricsAction**: A dedicated action class that orchestrates queries to various context repositories.
- Use Redis to cache complex analytical queries for 15-30 minutes to reduce database load.

## Frontend Architecture
- Implement a dashboard grid layout using CSS Grid.
- Fetch widgets asynchronously and independently using TanStack Query to prevent one slow query from blocking the entire page render.

## Testing Requirements
- **Backend**: Test that caching invalidation triggers correctly when underlying data changes. Test RBAC scoping.
- **Frontend**: Ensure Skeletons render correctly while data is fetching.
