# Notifications Skill

## Module Overview
The Notifications module manages the delivery of internal system alerts, emails, and SMS messages to users and customers.

## Responsibilities
- Aggregate in-app notifications (the "Bell" icon).
- Route external messages (Email via SES/SendGrid, SMS via Twilio).
- Manage user notification preferences.

## Business Rules
- Critical system alerts (e.g., "Server offline", "Financial reconciliation failed") bypass user preferences and are delivered immediately.
- Marketing emails require explicit opt-in (GDPR/CAN-SPAM compliance).

## User Roles & Permissions
- **All Users**: Can view their own notifications and configure preferences.

## Database Entities
- `notifications` (Laravel's default structure)
  - `id` (UUID)
  - `type` (String, e.g., 'App\Notifications\InvoicePaid')
  - `notifiable_type` (String)
  - `notifiable_id` (UUID)
  - `data` (JSON)
  - `read_at` (Timestamp, Nullable)

## APIs
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`
- `POST /api/v1/notifications/mark-all-read`

## UI Pages
- **`/settings/notifications`**: User preference configuration.
- **Dropdown Menu**: In the `TopNav` to view recent alerts.

## shadcn/ui Components to Use
- `Popover` or `Dropdown Menu`: For the notification bell dropdown.
- `Scroll Area`: To scroll through long lists of notifications within the popover.
- `Switch`: For toggling notification preferences.

## Backend Architecture
- Heavily utilize Laravel's `Notification` facade.
- Channels: Use `database` for in-app, `mail` for emails, and a custom channel for SMS or Push (Firebase).
- Always push notifications to a queue (RabbitMQ) using `ShouldQueue` to prevent blocking the web request.

## Frontend Architecture
- For real-time in-app notifications, integrate Laravel Reverb (WebSockets). 
- Update the global notification count in the Zustand store when a WebSocket event is received.

## Testing Requirements
- Test that queueing a notification successfully dispatches the job without failing.
