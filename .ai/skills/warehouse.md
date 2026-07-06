# Warehouse Skill

## Module Overview
The Warehouse module (Inventory Control) tracks building materials, tools, and consumables. It manages multiple storage locations, stock levels, and material transfers to construction sites.

## Responsibilities
- Track physical inventory of materials (e.g., Cement, Steel, Bricks) across multiple warehouses.
- Process Goods Receipt Notes (GRN) when items arrive from suppliers.
- Process Material Issue Slips (MIS) when items are sent to a project.

## Business Rules
- Stock levels cannot fall below zero.
- Re-order alerts should trigger when stock falls below the defined minimum threshold.
- Inventory valuation should use FIFO (First-In-First-Out) or Moving Average Cost.

## User Roles & Permissions
- **Warehouse Manager**: Receives goods, dispatches materials, performs stock counts.
- **Site Supervisor**: Requests materials from the warehouse.
- **Procurement**: Views low stock alerts.

## Database Entities
- `materials` (Master Catalog)
  - `id` (UUID)
  - `sku` (String)
  - `name` (String)
  - `uom` (Unit of Measure, e.g., 'bags', 'tons')
- `warehouses`
  - `id` (UUID)
  - `name` (String)
- `inventory_levels`
  - `warehouse_id` (UUID)
  - `material_id` (UUID)
  - `quantity` (Decimal)
- `stock_transactions` (Ledger)
  - `material_id` (UUID)
  - `warehouse_id` (UUID)
  - `type` (Enum: receipt, issue, transfer, adjustment)
  - `quantity` (Decimal)
  - `reference_id` (UUID, polymorphic)

## APIs
- `GET /api/v1/warehouse/inventory`
- `POST /api/v1/warehouse/issue` (Dispatch to project)
- `POST /api/v1/warehouse/receive`

## UI Pages
- **`/warehouse/dashboard`**: Low stock alerts, recent transactions.
- **`/warehouse/items`**: Master item catalog and current global stock.

## shadcn/ui Components to Use
- `Data Table`: Essential for large inventory lists.
- `Command` (Combobox): For searching and selecting materials quickly when creating an Issue Slip.
- `Alert`: To highlight items that have fallen below reorder levels.

## Backend Architecture
- **Event Sourcing / Ledger Pattern**: Never update `inventory_levels.quantity` directly. Always insert a `stock_transaction` and calculate the current level (or update the cached level in an observer/transaction). This guarantees an audit trail.

## Frontend Architecture
- Material selection forms must support barcode scanning (typically acts as fast keyboard input, so ensure the `Input` fields handle rapid firing correctly and auto-submit).

## Testing Requirements
- Concurrency testing: Simulate two users dispatching the last 10 bags of cement simultaneously. The database transactions and locks (`lockForUpdate()`) must ensure one fails and stock doesn't drop below 0.
