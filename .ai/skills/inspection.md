# Inspection Skill

## Module Overview
The Inspection (Quality Assurance) module manages scheduled and ad-hoc physical inspections of properties, materials, and safety protocols to ensure compliance with company and regulatory standards.

## Responsibilities
- Define standard Inspection Checklists (e.g., "Pre-Handover Checklist", "Foundation Safety Check").
- Schedule inspections and assign them to Quality Assurance (QA) Inspectors.
- Record inspection results (Pass/Fail) and capture photographic evidence.

## Business Rules
- A construction phase cannot be marked as 100% complete until its mandatory inspection passes.
- A failed inspection must automatically generate a Snag (Issue) in the Construction module.

## User Roles & Permissions
- **QA Inspector**: Conducts inspections, uploads evidence, marks pass/fail.
- **Project Manager**: Reviews inspection reports.
- **Safety Officer**: Creates checklist templates.

## Database Entities
- `inspection_templates` (Checklists)
  - `id` (UUID)
  - `name` (String)
  - `items` (JSON Array of check items)
- `inspections`
  - `id` (UUID)
  - `project_id` (UUID)
  - `house_id` (UUID, Nullable)
  - `template_id` (UUID)
  - `inspector_id` (UUID)
  - `status` (Enum: scheduled, completed, failed)
  - `date_scheduled` (Date)
  - `date_completed` (Date, Nullable)
- `inspection_results`
  - `inspection_id` (UUID)
  - `results` (JSON: mapping checklist items to pass/fail and notes)
  - `evidence_urls` (JSON Array of S3 URLs)

## APIs
- `GET /api/v1/inspections`
- `POST /api/v1/inspections`
- `POST /api/v1/inspections/{id}/complete`

## UI Pages
- **`/inspections/calendar`**: View upcoming inspections.
- **`/inspections/{id}/execute`**: A mobile-optimized view for the inspector to tick off checklist items in the field.

## shadcn/ui Components to Use
- `Checkbox`: Heavily used for the checklist UI.
- `Calendar`: For scheduling.
- `Dialog`: For uploading photo evidence on a specific checklist item.

## Backend Architecture
- Completing an inspection triggers a Domain Event. If the status is `failed`, a listener should automatically dispatch a command to the Construction module to create a Snag.

## Frontend Architecture
- The execution view MUST be highly responsive and mobile-friendly, as inspectors will likely be using tablets on site.
- Support offline capabilities (PWA/Service Workers) if possible, syncing results when the device reconnects.

## Testing Requirements
- E2E Test: Simulate failing an inspection and verify that a corresponding Snag appears in the Project's issue tracker.
