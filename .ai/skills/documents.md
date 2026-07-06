# Documents Skill

## Module Overview
The Documents module is a centralized Document Management System (DMS) that handles the storage, versioning, and retrieval of all files across the ERP (Contracts, Blueprints, Receipts).

## Responsibilities
- Securely store files in cloud storage (AWS S3).
- Track document versions (e.g., Blueprint v1 -> Blueprint v2).
- Link documents to various polymorphic entities (Projects, Houses, Customers).

## Business Rules
- Documents attached to legally binding entities (like a signed Contract) become immutable and cannot be hard-deleted.
- Storage must be structured logically, ensuring tenant or project isolation at the bucket/prefix level.

## User Roles & Permissions
- **All Users**: Can upload and view documents attached to entities they have access to.
- **Admin**: Can hard-delete orphaned documents.

## Database Entities
- `documents`
  - `id` (UUID)
  - `file_name` (String)
  - `mime_type` (String)
  - `size_bytes` (Integer)
  - `storage_path` (String)
  - `version` (Integer)
  - `documentable_type` (String, polymorphic)
  - `documentable_id` (UUID)

## APIs
- `POST /api/v1/documents/upload`
- `GET /api/v1/documents/{id}/download` (Returns a presigned URL)

## UI Pages
- Rarely a standalone page. Usually embedded as a "Documents" tab within other modules (e.g., Project details, Customer profile).

## shadcn/ui Components to Use
- `Data Table`: For listing attached files.
- Custom Drag-and-Drop area built using `lucide-react` icons and standard HTML5 file APIs, wrapped in a `Card`.

## Backend Architecture
- Do NOT stream files through the PHP application server (it consumes too much memory).
- **Upload**: The frontend should request a Presigned POST URL from the backend, then upload the file directly to S3.
- **Download**: The backend generates a short-lived (5 min) Presigned GET URL.

## Frontend Architecture
- Use a robust file uploader library (like Uppy or React Dropzone) configured to upload directly to the S3 presigned URLs provided by the API.

## Testing Requirements
- Security: Ensure users cannot request a presigned URL for a document attached to a Project they do not have access to.
