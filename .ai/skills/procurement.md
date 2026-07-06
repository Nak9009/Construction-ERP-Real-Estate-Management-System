# Procurement Skill

## Module Overview
The Procurement module manages the purchasing lifecycle: from Purchase Requisitions (requests from the site) to Purchase Orders (issued to vendors), and tracking vendor bills.

## Responsibilities
- Manage the Vendor directory.
- Allow site supervisors to request materials via Purchase Requisitions (PR).
- Convert approved PRs into Purchase Orders (PO) sent to vendors.

## Business Rules
- A PO must be approved by a Manager/Director if the total amount exceeds a configured threshold.
- A PO cannot be closed until a matching Goods Receipt Note (from the Warehouse module) is recorded (3-way matching: PO -> GRN -> Bill).

## User Roles & Permissions
- **Site Supervisor**: Creates PRs.
- **Procurement Officer**: Creates POs, manages vendors.
- **Executive**: Approves high-value POs.

## Database Entities
- `vendors`
  - `id` (UUID)
  - `name` (String)
  - `payment_terms` (String)
- `purchase_orders`
  - `id` (UUID)
  - `po_number` (String)
  - `vendor_id` (UUID)
  - `status` (Enum: draft, pending_approval, approved, issued, fulfilled, closed)
  - `total_amount` (BigInteger, Cents)
- `purchase_order_lines`
  - `po_id` (UUID)
  - `material_id` (UUID)
  - `quantity` (Decimal)
  - `unit_price` (BigInteger)

## APIs
- `GET /api/v1/procurement/vendors`
- `GET /api/v1/procurement/orders`
- `POST /api/v1/procurement/orders`
- `POST /api/v1/procurement/orders/{id}/approve`

## UI Pages
- **`/procurement/vendors`**: Vendor list.
- **`/procurement/orders`**: List of POs.
- **`/procurement/orders/create`**: Complex form for building a PO with line items.

## shadcn/ui Components to Use
- `Form` with `useFieldArray`: Essential for managing the dynamic list of line items in a PO.
- `Badge`: For PO statuses.
- `Dialog`: For approval workflows (asking for a digital signature or confirmation note).

## Backend Architecture
- The state machine for a PO is complex. Use a dedicated State Machine package or strict domain action classes to ensure a PO cannot jump from `draft` to `fulfilled` directly.
- Fulfilling a PO should dispatch an event that the Finance module listens to in order to create an Account Payable.

## Frontend Architecture
- The PO creation form handles complex state (calculating subtotals, taxes, and grand totals in real-time). Use `react-hook-form`'s `watch` to update totals without triggering full page re-renders.

## Testing Requirements
- Verify the approval threshold logic (e.g., POs under $5,000 auto-approve, over $5,000 require manager ID).
