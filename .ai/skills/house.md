# House Skill

## Module Overview
The House module manages the physical buildings constructed on a Lot. It tracks the house type (model), specifications, and overall construction status.

## Responsibilities
- Define standard House Types/Models (e.g., "Villa 3-Bed", "Townhouse").
- Link a specific House construction to a specific Lot.
- Track total estimated construction cost vs actual.

## Business Rules
- A House must be assigned to exactly one Lot.
- A Lot can only have one House.
- House Types act as blueprints; when a House is created, it inherits the blueprint's default timeline and bill of materials.

## User Roles & Permissions
- **Architect/Engineer**: Defines House Types.
- **Project Manager**: Assigns Houses to Lots.
- **Sales Agent**: Views house details for selling.

## Database Entities
- `house_types`
  - `id` (UUID)
  - `name` (String)
  - `base_price` (BigInteger)
  - `floor_area_sqm` (Decimal)
- `houses`
  - `id` (UUID)
  - `lot_id` (UUID, FK -> lots, Unique)
  - `house_type_id` (UUID, FK -> house_types, Nullable for custom builds)
  - `status` (Enum: planned, under_construction, completed)
  - `construction_cost` (BigInteger)

## APIs
- `GET /api/v1/houses`
- `POST /api/v1/lots/{lot_id}/houses`
- `GET /api/v1/house-types`

## UI Pages
- **`/inventory/houses`**: Data Table of all houses and their statuses.
- **`/inventory/houses/{id}`**: Detailed view showing the blueprint, actual construction progress, and sales status.

## shadcn/ui Components to Use
- `Card`: To display House Models in a grid (Image, Title, Specs).
- `Badge`: For status (`planned` = neutral, `under_construction` = blue, `completed` = green).

## Backend Architecture
- Creating a House from a `HouseType` should trigger a `HouseCreatedEvent`, which the Timeline module listens to in order to generate the default construction schedule.

## Frontend Architecture
- Use image carousels or galleries to show blueprints/renders in the `HouseType` details.

## Testing Requirements
- Verify the 1:1 constraint between House and Lot (creating a second house on the same lot must fail).
