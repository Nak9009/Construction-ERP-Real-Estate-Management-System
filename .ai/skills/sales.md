# Sales Skill

## Module Overview
The Sales module manages the CRM aspect of the business: capturing leads, managing the sales pipeline, generating quotes, and formalizing Sales Contracts for Lots or Houses.

## Responsibilities
- Manage the lead pipeline (Prospect -> Qualified -> Negotiation -> Closed).
- Generate Sales Quotes and Payment Plans.
- Manage formal Sales Contracts (linking a Customer to a Lot/House).

## Business Rules
- A Lot/House can only have one active Sales Contract at a time.
- Signing a Sales Contract automatically reserves the associated Lot/House.
- If a contract is cancelled, the inventory must be automatically released back to 'Available'.

## User Roles & Permissions
- **Sales Agent**: Manages their own leads and generates quotes.
- **Sales Manager**: Views the entire team's pipeline, approves discounts.
- **Legal**: Reviews and approves the final Contract wording.

## Database Entities
- `leads`
  - `id` (UUID)
  - `customer_id` (UUID)
  - `status` (Enum: new, contacted, qualified, lost)
  - `assigned_to` (UUID, FK -> users)
- `sales_contracts`
  - `id` (UUID)
  - `contract_number` (String, Unique)
  - `customer_id` (UUID)
  - `inventory_type` (Enum: lot, house)
  - `inventory_id` (UUID)
  - `amount` (BigInteger)
  - `status` (Enum: draft, pending_signature, active, completed, cancelled)
- `payment_plans`
  - `contract_id` (UUID)
  - `installment_number` (Integer)
  - `due_date` (Date)
  - `amount` (BigInteger)

## APIs
- `GET /api/v1/sales/leads`
- `GET /api/v1/sales/contracts`
- `POST /api/v1/sales/contracts`
- `PATCH /api/v1/sales/contracts/{id}/status`

## UI Pages
- **`/sales/pipeline`**: Kanban board for leads.
- **`/sales/contracts`**: List of contracts.
- **`/sales/contracts/{id}`**: Contract detail, including payment plan and document attachments.

## shadcn/ui Components to Use
- Custom Kanban board built with generic `Card` components or `dnd-kit`.
- `Badge`: To indicate contract status.
- `Accordion`: To collapse/expand the details of a complex payment plan.

## Backend Architecture
- A state transition on a `sales_contract` (e.g., to `active`) should fire an event. The Inventory module listens to this to update the Lot/House status. The Finance module listens to generate the initial Accounts Receivable invoice.

## Frontend Architecture
- The quote generator requires complex client-side calculations (calculating amortization or installment splits). Use `react-hook-form` and perform math operations safely.

## Testing Requirements
- Concurrency test: Ensure two sales agents cannot simultaneously sign a contract for the exact same Lot.
