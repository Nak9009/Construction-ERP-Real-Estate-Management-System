# Analytics Skill

## Module Overview
The Analytics module is the BI (Business Intelligence) engine of the ERP. It provides complex data visualizations, trends, and forecasting based on historical data.

## Responsibilities
- Aggregate massive datasets (Sales trends, Construction delays, Financial cash flows).
- Present interactive charts and dashboards.
- Provide data exports (CSV/Excel).

## Business Rules
- Analytical queries must never block or slow down the primary transactional database.
- Data presented in Analytics may have a slight delay (eventual consistency) depending on the caching strategy.

## User Roles & Permissions
- **Executives / Directors**: Full access to all BI dashboards.
- **Department Heads**: Access restricted to their domain (e.g., Sales Manager sees only Sales BI).

## Database Entities
- No distinct transactional tables. This module queries read-replicas, materialized views, or an external Data Warehouse.

## APIs
- `GET /api/v1/analytics/sales-trends`
- `GET /api/v1/analytics/construction-velocity`

## UI Pages
- **`/analytics`**: The BI control center.

## shadcn/ui Components to Use
- `Recharts`: Wrapped in generic `Card` components to build Bar, Line, and Pie charts.
- `Select` / `Calendar`: For complex date range filtering.

## Backend Architecture
- **Read Replicas**: Configure Laravel's database connections to route these complex `SELECT` queries to a read replica.
- **Materialized Views**: If using MySQL, use scheduled jobs to populate physical summary tables nightly to speed up daytime dashboard loading.

## Frontend Architecture
- Ensure Recharts components are wrapped in React `Suspense` or use dynamic imports (`next/dynamic` with `ssr: false`) as heavy charting libraries can cause hydration errors or slow down initial SSR times in Next.js.

## Testing Requirements
- Verify that analytical queries are routed to the read connection (using DB connection assertions).
