# Construction ERP & Real Estate Management System — API Documentation

Base Endpoint URL: `http://localhost:8000/api/v1`

---

## 🔐 Authentication Module

### 1. User Login
- **Endpoint**: `POST /auth/login`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "sokha.chan@pphousing.com",
    "password": "Password123!",
    "device_name": "chrome-mac"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "1|sanctum_personal_access_token_hash_here",
    "user": {
      "id": "user-uuid-here",
      "name": "Sokha Chan",
      "email": "sokha.chan@pphousing.com",
      "company_id": "company-uuid-here",
      "roles": ["Project Manager"],
      "permissions": ["view_projects", "update_projects", "manage_milestones_projects"]
    }
  }
  ```

### 2. User Profile
- **Endpoint**: `GET /auth/profile`
- **Authentication Required**: Yes (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "id": "user-uuid-here",
      "name": "Sokha Chan",
      "email": "sokha.chan@pphousing.com",
      "company_id": "company-uuid-here",
      "phone": "+855887654321",
      "avatar": null,
      "roles": ["Project Manager"],
      "permissions": [...]
    },
    "company": {
      "id": "company-uuid-here",
      "name": "Phnom Penh Housing Co., Ltd.",
      "logo": null,
      "address": "Veng Sreng Blvd, Phnom Penh, Cambodia",
      "status": "active",
      "settings": {
        "timezone": "Asia/Phnom_Penh",
        "currency": "USD",
        "language": "en"
      }
    }
  }
  ```

### 3. User Logout
- **Endpoint**: `POST /auth/logout`
- **Authentication Required**: Yes (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 🏗️ Project Management Module

### 1. List Projects
- **Endpoint**: `GET /projects`
- **Authentication Required**: Yes (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "projects": [
      {
        "id": "project-uuid-here",
        "company_id": "company-uuid-here",
        "name": "Green City Phase 1",
        "address": "Chroy Changvar District, Phnom Penh, Cambodia",
        "lat": "11.62145300",
        "lng": "104.93129800",
        "budget": "2500000.00",
        "start_date": "2026-01-01",
        "end_date": "2027-12-31",
        "status": "in_progress",
        "description": "A boutique gated community featuring 120 modern luxury homes.",
        "created_at": "2026-07-01T08:00:00.000000Z",
        "updated_at": "2026-07-01T08:00:00.000000Z",
        "deleted_at": null,
        "milestones_count": 2
      }
    ]
  }
  ```

### 2. Show Project Details
- **Endpoint**: `GET /projects/{project_uuid}`
- **Authentication Required**: Yes (Bearer Token)
- **Response (200 OK)**:
  ```json
  {
    "project": {
      "id": "project-uuid-here",
      "name": "Green City Phase 1",
      ...
      "milestones": [
        {
          "id": "milestone-uuid-here",
          "project_id": "project-uuid-here",
          "name": "Land Preparation & Excavation",
          "target_date": "2026-03-01",
          "completed_date": "2026-03-10",
          "status": "completed"
        }
      ],
      "risks": [],
      "land": {
        "id": "land-uuid-here",
        "project_id": "project-uuid-here",
        "owner_name": "Chroy Changvar Land Development S.A.",
        "purchase_price": "1200000.00",
        "title_number": "Title No. ChroyChangvar-2025-889A",
        "lat": "11.62145300",
        "lng": "104.93129800",
        "polygon": [...],
        "area_sqm": "15000.00",
        "blocks": [...]
      }
    }
  }
  ```

---

## 🔨 Construction Tracker Module

### 1. Update Stage Progress
- **Endpoint**: `PUT /construction/stages/{stage_uuid}/progress`
- **Authentication Required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "progress_pct": 85.50,
    "status": "in_progress",
    "notes": "Foundation concrete poured. Currently curing.",
    "start_date": "2026-02-01"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Stage progress updated successfully",
    "stage": {
      "id": "stage-uuid-here",
      "house_id": "house-uuid-here",
      "stage_type": "foundation",
      "status": "in_progress",
      "progress_pct": "85.50",
      "start_date": "2026-02-01",
      "end_date": null,
      "cost": "35000.00",
      "notes": "Foundation concrete poured. Currently curing."
    }
  }
  ```

### 2. Log Material Consumption
- **Endpoint**: `POST /construction/stages/{stage_uuid}/materials`
- **Authentication Required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "material_id": "material-uuid-here",
    "quantity_planned": 100.00,
    "quantity_used": 95.00,
    "unit_cost": 8.50
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Stage material logged successfully",
    "material": {
      "id": "stage-material-uuid-here",
      "stage_id": "stage-uuid-here",
      "material_id": "material-uuid-here",
      "quantity_planned": "100.0000",
      "quantity_used": "95.0000",
      "unit_cost": "8.5000"
    }
  }
  ```
