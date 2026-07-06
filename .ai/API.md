# API.md

## Purpose
This document defines the strict design standards for the REST API powering the Construction ERP. It ensures a consistent developer experience for the web frontend, mobile apps, and third-party integrations.

## Standard Protocols
- **Format**: JSON (`application/json`) for both request bodies and responses.
- **Protocol**: HTTPS is mandatory for all requests.

## URL Structure & Versioning
APIs must be versioned in the URL path. Use plural nouns for resources. Do not use verbs in the URL (except for specific complex actions).
- **Format**: `/api/v{version}/{resources}`
- **Example**: `/api/v1/projects`, `/api/v1/projects/{id}/tasks`

## Authentication & Authorization
- All endpoints (except login/register/webhooks) must require authentication via a Bearer Token (JWT or Laravel Sanctum).
- Authorization must be enforced at the Controller layer using Laravel Policies. E.g., `$this->authorize('view', $project);`

## Standard Endpoints (CRUD)
For a resource named `Project`:
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects/{id}` - Get a specific project
- `PUT /api/v1/projects/{id}` - Replace a project (entire entity)
- `PATCH /api/v1/projects/{id}` - Update a project (partial entity)
- `DELETE /api/v1/projects/{id}` - Delete a project

## Complex Actions
When an action does not map cleanly to CRUD, use a verb as a sub-resource.
- `POST /api/v1/invoices/{id}/approve`
- `POST /api/v1/projects/{id}/archive`

## Request Parameters

### 1. Pagination
Use cursor-based pagination for high-volume endpoints (e.g., activity logs) and offset-based pagination for tables where the user expects page numbers.
- `GET /api/v1/projects?page=2&per_page=50`
- `GET /api/v1/logs?cursor={encoded_string}`

### 2. Filtering
Use explicit query parameters or a bracket syntax for complex filters.
- Simple: `GET /api/v1/projects?status=active`
- Complex: `GET /api/v1/projects?filter[status]=active&filter[budget][gt]=100000`

### 3. Sorting
Use the `sort` parameter. Prefix with `-` for descending order.
- `GET /api/v1/projects?sort=-created_at,name`

### 4. Inclusion (Eager Loading)
Allow clients to request related entities to reduce API calls.
- `GET /api/v1/projects/{id}?include=manager,tasks`

## Response Formats (JSend Inspired)
All responses must follow a consistent envelope structure. Do not return raw arrays or objects without an envelope.

### Success Response (200, 201)
```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Downtown Skyscraper",
    "created_at": "2026-07-06T12:00:00Z"
  }
}
```

### Collection Response with Pagination
```json
{
  "status": "success",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 50,
    "total": 500
  },
  "links": {
    "next": "/api/v1/projects?page=2"
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "status": "error",
  "message": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "errors": {
    "budget": [
      "The budget must be a positive integer."
    ]
  },
  "request_id": "req-98765"
}
```

## HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH.
- `201 Created`: Successful POST.
- `204 No Content`: Successful DELETE (or return 200 with soft-delete status).
- `400 Bad Request`: Invalid request formatting.
- `401 Unauthorized`: Missing or invalid auth token.
- `403 Forbidden`: Authenticated, but lacks permissions.
- `404 Not Found`: Resource does not exist.
- `422 Unprocessable Entity`: Validation errors.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: An unhandled backend exception.

## Best Practices
- **Idempotency**: All `PUT` and `DELETE` requests must be idempotent. Repeating the request should not change the state further. For critical `POST` actions (e.g., payments), use an Idempotency-Key header.
- **Rate Limiting**: Enforce strict rate limits based on IP and User ID to prevent abuse.
- **OpenAPI/Swagger**: All APIs must be documented using OpenAPI 3.0 specification.
