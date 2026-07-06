# Customer Skill

## Module Overview
The Customer module serves as the central directory for all external clients, prospects, and buyers. It provides a 360-degree view of the customer's interactions with the company.

## Responsibilities
- Store customer profiles (Individuals and Corporate entities).
- Track KYC (Know Your Customer) and compliance documents.
- Aggregate all related records (Leads, Contracts, Invoices, Support Tickets).

## Business Rules
- Customer records cannot be deleted if they are linked to an active Contract or Invoice (must be soft-deleted or archived).
- Corporate customers must have at least one designated Primary Contact person.

## User Roles & Permissions
- **Sales Agent**: Can create and edit their assigned customers.
- **Customer Support**: Can view customer profiles and log interactions.
- **Admin**: Can reassign customers between agents.

## Database Entities
- `customers`
  - `id` (UUID)
  - `type` (Enum: individual, corporate)
  - `first_name` (String)
  - `last_name` (String)
  - `company_name` (String, Nullable)
  - `email` (String)
  - `phone` (String)
  - `kyc_status` (Enum: pending, verified, rejected)
- `customer_interactions`
  - `customer_id` (UUID)
  - `agent_id` (UUID)
  - `type` (Enum: call, email, meeting)
  - `notes` (Text)
  - `date` (Timestamp)

## APIs
- `GET /api/v1/customers`
- `POST /api/v1/customers`
- `GET /api/v1/customers/{id}` (Aggregates Contracts, Invoices, Interactions)

## UI Pages
- **`/customers`**: Data table of all customers.
- **`/customers/{id}`**: A 360-degree dashboard view for a single customer.

## shadcn/ui Components to Use
- `Avatar`: For displaying customer initials or uploaded photos.
- `Tabs`: In the detail view to switch between Profile, Contracts, Financials, and Activity History.
- `Sheet`: For a quick "Log Interaction" flyout.

## Backend Architecture
- The GET `{id}` API should utilize API Resources that eager-load specific relationships only if requested via the `?include=contracts,invoices` query parameter to keep the payload size manageable.

## Frontend Architecture
- The 360-degree view should fetch data concurrently (e.g., using `Promise.all` in the loader, or parallel TanStack Queries) to populate the various tabs without waiting for the slowest query.

## Testing Requirements
- Validation: Ensure `first_name` and `last_name` are required if `type` is individual, but `company_name` is required if `type` is corporate.
