# Company Skill

## Module Overview
The Company module manages the core organizational structure, legal entity details, global settings, and fiscal configurations for the ERP. 

## Responsibilities
- Store global company profile (Name, Logo, Tax IDs).
- Manage high-level system settings (Currency, Timezone, Fiscal Year start).
- Define top-level departments.

## Business Rules
- Only one active Company profile can exist unless the system is configured for Multi-Tenancy.
- Changing the base currency requires a full system audit lock and cannot be done if financial records exist.

## User Roles & Permissions
- **SuperAdmin**: Can edit company details and global settings.
- **All Users**: Read-only access to company name/logo for UI rendering.

## Database Entities
- `companies`
  - `id` (UUID)
  - `name` (String)
  - `tax_id` (String)
  - `base_currency` (String, 3-char code)
  - `fiscal_year_start` (Date)
- `settings`
  - `key` (String, Unique)
  - `value` (JSON)

## APIs
- `GET /api/v1/company`
- `PUT /api/v1/company`
- `GET /api/v1/settings`
- `PUT /api/v1/settings`

## UI Pages
- **`/settings/company`**: Company profile management.
- **`/settings/system`**: Global system preferences.

## shadcn/ui Components to Use
- `Form`, `Input`, `Select`: For configuration settings.
- `Alert`: To warn about destructive actions (like changing currency).
- `Avatar`: For the company logo upload preview.

## Backend Architecture
- **Company Context**: Isolated in `Domain/Company`.
- Settings should be cached in Redis indefinitely, only cleared via a model observer on the `settings` table when updated.

## Frontend Architecture
- Global settings (like currency symbol, timezone) should be fetched at app initialization and stored in a Zustand global store or React Context for synchronous access across the app.

## Testing Requirements
- Verify that attempting to change the base currency after transactions exist throws a Domain Exception.
