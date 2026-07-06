# Mobile Skill

## Module Overview
The Mobile module defines the interface and architecture for the Flutter-based mobile applications used by Site Supervisors, QA Inspectors, and Sales Agents in the field.

## Responsibilities
- Provide offline-capable data entry for daily logs, snags, and inspections.
- Utilize device hardware (Camera, GPS) to attach rich context to records.
- Consume the Laravel REST API securely.

## Business Rules
- The mobile app must remain fully functional for data capture even when the device loses cellular/WiFi connection on remote construction sites.
- Data synchronization must resolve conflicts gracefully (server timestamp wins).

## User Roles & Permissions
- Governed entirely by the existing Laravel RBAC (Role-Based Access Control) system via the API.

## Database Entities
- No dedicated backend entities. The mobile app interacts with `daily_logs`, `snags`, `inspections`, etc.

## APIs
- The mobile app consumes the standard `/api/v1/*` endpoints.
- Special `/api/v1/sync` endpoints may be required for bulk offline data synchronization.

## UI Pages (Flutter)
- **Home**: Role-specific dashboard (e.g., My Inspections, My Leads).
- **Camera View**: Custom implementation for capturing and annotating inspection evidence.

## Flutter Components & Libraries to Use
- **State Management**: BLoC or Riverpod.
- **Local Storage**: Hive, Isar, or SQLite for offline caching.
- **Networking**: Dio (for robust interceptors and token refresh logic).
- **UI**: Material 3 guidelines.

## Backend Architecture
- The Laravel API must support JWT or Sanctum token-based authentication.
- Endpoints serving the mobile app should keep payloads lean. Eager load only what is strictly necessary for the mobile view.

## Frontend (Mobile) Architecture
- **Offline First**: All `GET` requests read from the local SQLite/Isar database first. A background process syncs local data with the remote API.
- All `POST`/`PUT` requests write to the local database and queue a sync job. When connection is restored, the queue is flushed to the Laravel backend.

## Testing Requirements
- **Mobile**: Flutter widget and integration tests.
- **API**: Ensure the backend can handle bulk-sync payloads containing arrays of records created offline.
