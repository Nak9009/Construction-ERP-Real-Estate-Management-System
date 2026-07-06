# Warranty Skill

## Module Overview
The Warranty (Post-Handover Customer Care) module handles customer complaints and maintenance requests after a property has been handed over.

## Responsibilities
- Track the validity period of the property warranty.
- Log customer reported issues (Claims/Tickets).
- Assign contractors or maintenance staff to resolve claims.

## Business Rules
- A warranty claim can only be created if the property's warranty period has not expired (unless overridden by a Manager).
- Resolution costs are logged against a distinct "Warranty/Maintenance" budget, not the original construction budget.

## User Roles & Permissions
- **Customer Support**: Logs the initial claim based on customer calls/emails.
- **Maintenance Manager**: Assesses the claim and dispatches workers.
- **Customer**: Can view the status of their claims via a customer portal.

## Database Entities
- `warranties`
  - `id` (UUID)
  - `house_id` (UUID)
  - `start_date` (Date)
  - `end_date` (Date)
- `warranty_claims` (Tickets)
  - `id` (UUID)
  - `warranty_id` (UUID)
  - `customer_id` (UUID)
  - `description` (Text)
  - `status` (Enum: open, investigating, repairing, closed)
  - `cost_incurred` (Integer, Cents)

## APIs
- `GET /api/v1/warranty/claims`
- `POST /api/v1/warranty/claims`
- `PATCH /api/v1/warranty/claims/{id}/status`

## UI Pages
- **`/warranty/dashboard`**: Ticket queue.
- **`/warranty/claims/{id}`**: Detailed view of a claim, communication logs, and cost tracking.

## shadcn/ui Components to Use
- `Data Table`: For the ticketing queue.
- `Badge`: For urgency and status.
- `Sheet`: To slide out the ticket details without losing context of the queue.

## Backend Architecture
- The module acts like a mini-Helpdesk. Use the Spatie Laravel-Tags package or similar to allow tagging tickets with specific defect types (e.g., 'plumbing', 'electrical').

## Frontend Architecture
- Implement a chat-like interface inside the claim detail view to log communication history between the agent and the customer.

## Testing Requirements
- Date validation: Ensure the API rejects a new claim if `current_date > warranty.end_date` without a manager override token.
