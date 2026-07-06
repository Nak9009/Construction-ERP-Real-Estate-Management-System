# Reports Skill

## Module Overview
The Reports module handles the generation, scheduling, and distribution of formal business reports (PDFs, Excel spreadsheets) required by stakeholders, auditors, and regulatory bodies.

## Responsibilities
- Generate pixel-perfect PDF documents (Invoices, Contracts, Project Summaries).
- Export large datasets to Excel/CSV for offline analysis.
- Schedule recurring reports (e.g., "Weekly Financial Summary sent every Friday at 5 PM").

## Business Rules
- Financial and legal reports must be immutable once generated and stored in the Documents module for compliance.
- Exporting > 10,000 rows must be handled asynchronously to prevent memory exhaustion and PHP timeouts.

## User Roles & Permissions
- **All Users**: Can download basic CSV exports of tables they have access to.
- **Admin/Managers**: Can configure scheduled reports.

## Database Entities
- `scheduled_reports`
  - `id` (UUID)
  - `user_id` (UUID)
  - `report_type` (String)
  - `cron_expression` (String)
  - `parameters` (JSON)
  - `recipients` (JSON Array of emails)

## APIs
- `POST /api/v1/reports/export`
- `POST /api/v1/reports/scheduled`

## UI Pages
- **`/reports`**: Central hub to generate on-demand reports and configure scheduled ones.

## shadcn/ui Components to Use
- `Select` / `Combobox`: For selecting report types and parameters.
- `Form`: For configuring the cron schedule.

## Backend Architecture
- **PDF Generation**: Use a robust HTML-to-PDF engine like `spatie/laravel-pdf` (wrapping Puppeteer/Browsershot) or `barryvdh/laravel-dompdf`. Browsershot provides better modern CSS support (Tailwind).
- **Excel Generation**: Use `maatwebsite/excel` (Laravel Excel). For massive exports, utilize their queued chunk reading/writing features.
- All report generations must be dispatched to RabbitMQ as queued Jobs. Once the job finishes, a notification is sent to the user with a secure download link.

## Frontend Architecture
- Show a persistent loading state or a "Your export is processing, we will notify you when it's ready" `Toast` message when an export is requested, instead of blocking the UI.

## Testing Requirements
- Test that scheduled report jobs are correctly picked up by Laravel's Scheduler (`php artisan schedule:run`).
