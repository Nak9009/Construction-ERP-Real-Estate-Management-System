# Lot Skill

## Module Overview
The Lot module manages the individual parcels of land that can be sold independently or built upon. It is the atomic unit of the real estate inventory.

## Responsibilities
- Track exact dimensions, area, and coordinates of a specific lot.
- Manage the selling price of the bare land (if sold without a house).
- Track the current status (Available, Reserved, Sold).

## Business Rules
- A Lot can only be "Reserved" if there is an active Sales Contract pending.
- A Lot cannot be deleted once it has been involved in a Sales Contract or has an active House construction.

## User Roles & Permissions
- **Project Manager**: Creates and defines Lots.
- **Sales Agent**: Can view Available lots and reserve them (via Sales module).

## Database Entities
- `lots`
  - `id` (UUID)
  - `block_id` (UUID, FK -> blocks)
  - `lot_number` (String, e.g., "A-01")
  - `area_sqm` (Decimal)
  - `price` (BigInteger, Cents)
  - `status` (Enum: available, reserved, sold)
  - `geospatial_data` (JSON/Polygon)

## APIs
- `GET /api/v1/lots`
- `POST /api/v1/blocks/{block_id}/lots`
- `PATCH /api/v1/lots/{id}/status`

## UI Pages
- **`/inventory/lots`**: Interactive grid or map showing all lots.

## shadcn/ui Components to Use
- `Data Table`
- `Hover Card`: To show quick details (price, area) when hovering over a lot on a visual map.

## Backend Architecture
- The `LotStatus` is primarily driven by Domain Events from the Sales context (e.g., `ContractSignedEvent` updates lot to `sold`).

## Frontend Architecture
- Map integrations should color-code lots based on status (Green=Available, Yellow=Reserved, Red=Sold).

## Testing Requirements
- Verify that attempting to reserve an already 'sold' lot throws an appropriate exception.
