# Land Skill

## Module Overview
The Land module manages the acquisition, legal documentation, and geographical boundaries of raw land parcels before they are subdivided into Blocks and Lots for a Project.

## Responsibilities
- Track land acquisition costs, dates, and sellers.
- Manage legal documents (Deeds, Title Certificates, Zoning approvals).
- Store geospatial data (Polygons, Coordinates).

## Business Rules
- Land cannot be assigned to a Project until the Title Status is "Clear" and acquisition is fully paid.
- Total subdivided Lot area cannot exceed the total Land area.

## User Roles & Permissions
- **Legal/Compliance**: Can upload deeds and change Title Status.
- **Project Manager**: Can view land details and subdivide into Blocks/Lots.

## Database Entities
- `lands`
  - `id` (UUID)
  - `name_or_parcel_id` (String)
  - `total_area_sqm` (Decimal)
  - `acquisition_cost` (BigInteger, Cents)
  - `acquisition_date` (Date)
  - `title_status` (Enum: pending, clear, disputed)
  - `geospatial_data` (JSON/Polygon)

## APIs
- `GET /api/v1/lands`
- `POST /api/v1/lands`
- `POST /api/v1/lands/{id}/documents`

## UI Pages
- **`/inventory/land`**: List of acquired land parcels.
- **`/inventory/land/{id}`**: Detailed view, including a Map component.

## shadcn/ui Components to Use
- `Data Table`: For land registry.
- `Dialog`: For uploading legal documents.
- `Badge`: For Title Status (Clear=Green, Pending=Yellow, Disputed=Red).

## Backend Architecture
- Integrate with spatial database extensions (e.g., MySQL Spatial or PostGIS if migrated) for `geospatial_data`.
- Documents should be handled via standard Laravel File Storage (S3) generating presigned URLs for viewing.

## Frontend Architecture
- Integrate a mapping library (e.g., Mapbox or Google Maps, wrapped in a React component) to visualize the `geospatial_data`.

## Testing Requirements
- Validation testing: Ensure API rejects subdivision payloads where the sum of child areas exceeds `total_area_sqm`.
