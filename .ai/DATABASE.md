# DATABASE.md

## Purpose
This document outlines the database design, schema management, and performance optimization strategies for the MySQL database cluster underlying the ERP system.

## Scope
Applies to all database tables, migrations, relationships, and queries executed by the Laravel application.

## Naming Conventions
- **Tables**: `snake_case`, plural. Example: `purchase_orders`, `users`.
- **Columns**: `snake_case`. Example: `first_name`, `created_at`.
- **Primary Keys**: `id` (UUID format).
- **Foreign Keys**: `[singular_table_name]_id`. Example: `project_id`.
- **Pivot Tables**: Alphabetical combination of singular table names, separated by an underscore. Example: `role_user`, `project_worker`.

## Schema Design & Types

### 1. Primary Keys (UUIDs)
We use UUIDs (Universally Unique Identifiers) for all primary keys instead of auto-incrementing integers.
- **Why?** UUIDs are essential for distributed systems, offline mobile sync (Flutter), and obfuscating resource counts from API consumers.
- **Format**: Use UUID v7 or v4. Store as `CHAR(36)` or binary format depending on indexing requirements. Laravel’s `Str::uuid()` handles this.

### 2. Standard Columns
Every table representing a core entity must include:
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `deleted_at` (Timestamp, Nullable) - for soft deletes.
- `created_by` (UUID, Foreign Key) - Audit trail.
- `updated_by` (UUID, Foreign Key) - Audit trail.

### 3. Tenant Isolation
If the ERP system is multi-tenant, all tenant-specific tables must include a `tenant_id` column.
- The `tenant_id` must be part of composite indexes where appropriate to ensure tenant isolation queries are performant.
- Ensure Laravel Global Scopes are used to automatically filter queries by the authenticated user's `tenant_id`.

## Relationships & Integrity
- **Foreign Keys**: Must be strictly defined at the database level using Laravel Migrations.
- **Constraints**: Apply `ON DELETE RESTRICT` or `ON DELETE CASCADE` appropriately. Financial and audit records must *never* cascade delete; use `RESTRICT`.

## Performance Optimization

### 1. Indexing Strategy
- Index all Foreign Keys.
- Create Composite Indexes for frequently queried combinations (e.g., `tenant_id` + `status`).
- Use Partial/Filtered indexes if supported, or design queries to leverage standard BTrees efficiently.

### 2. Partitioning
For tables projected to grow beyond millions of rows (e.g., `audit_logs`, `sensor_data`, `financial_transactions`), implement database partitioning.
- Partition by date (e.g., Monthly or Yearly ranges) to allow fast archiving and pruning.

### 3. Transactions
- All operations that mutate multiple related tables (e.g., approving an invoice which deducts a budget and creates a journal entry) MUST be wrapped in a database transaction.
- Use Laravel's `DB::transaction(function () { ... })`.

### 4. N+1 Query Problem
- Strictly avoid N+1 queries. Always use Eloquent's `with()` method to eager load relationships when querying multiple records.
- Enforce Laravel's `Model::preventNPlusOneQuery()` in the `AppServiceProvider` during local development to catch these issues early.

## Migrations & Seeding
- Schema changes are only permitted via Laravel Migrations.
- **Do not modify existing migrations** once they have been merged to `main`. Create a new migration to alter the table.
- Seeders must be provided for reference data (e.g., Statuses, Roles, Countries).
- Factories must be comprehensive to support automated testing.

## Anti-Patterns
- Using `JSON` columns for highly relational data that frequently needs to be filtered or aggregated. Use JSON only for unstructured metadata or settings.
- Storing currency as Floats. Always store currency as Integers (cents/smallest denomination) to avoid floating-point arithmetic errors. E.g., $10.50 should be stored as `1050`.
