# Construction ERP & Real Estate Management System — ER Diagram

This document contains a Mermaid-based Entity-Relationship (ER) Diagram representing all 45+ tables across all 23 ERP modules.

---

```mermaid
erDiagram
    %% Core Tables
    companies ||--o{ branches : "has"
    companies ||--o{ departments : "has"
    companies ||--o{ users : "has"
    companies ||--o{ audit_logs : "logs"
    branches ||--o{ departments : "has"
    departments ||--o{ employees : "employs"
    users ||--o? employees : "is"
    users ||--o? customers : "is"

    %% Project & Land Tables
    projects ||--o{ milestones : "has"
    projects ||--o{ project_risks : "has"
    projects ||--o| lands : "occupies"
    lands ||--o{ blocks : "contains"
    blocks ||--o{ lots : "subdivides"

    %% House & Construction Tables
    house_types ||--o{ houses : "defines"
    lots ||--o| houses : "supports"
    houses ||--o{ construction_stages : "tracks"
    construction_stages ||--o{ stage_workers : "assigns"
    construction_stages ||--o{ stage_materials : "consumes"
    construction_stages ||--o{ stage_media : "records"
    construction_stages ||--o{ inspections : "quality check"
    employees ||--o{ construction_stages : "manages"
    contractors ||--o{ construction_stages : "subcontracts"
    employees ||--o{ stage_workers : "works"
    materials ||--o{ stage_materials : "logs"

    %% Workforce & Equipment Tables
    employees ||--o{ employee_skills : "has"
    skills ||--o{ employee_skills : "classified"
    employees ||--o{ attendances : "tracks"
    projects ||--o{ attendances : "located"
    projects ||--o{ daily_reports : "logs"
    employees ||--o{ daily_reports : "reported by"
    equipment ||--o{ equipment_assignments : "tracks"
    projects ||--o{ equipment_assignments : "assigns"
    equipment ||--o{ fuel_logs : "tracks"
    equipment ||--o{ maintenance_records : "logs"

    %% Warehouse & Procurement Tables
    materials ||--o{ stock_movements : "tracks"
    projects ||--o{ stock_movements : "consumes"
    employees ||--o{ stock_movements : "logged by"
    suppliers ||--o{ purchase_orders : "supplies"
    projects ||--o{ purchase_orders : "buys for"
    purchase_orders ||--o{ purchase_order_items : "contains"
    materials ||--o{ purchase_order_items : "buys"
    rfqs ||--o{ rfq_responses : "receives"
    suppliers ||--o{ rfq_responses : "bids"
    purchase_orders ||--o{ goods_receipts : "receives"
    employees ||--o{ goods_receipts : "signed by"

    %% Financial Tables
    projects ||--o{ budgets : "allocates"
    invoices ||--o{ payments : "receives"
    projects ||--o{ expenses : "charges"
    employees ||--o{ expenses : "approved by"

    %% Sales & Customer Tables
    leads ||--o{ quotations : "receives"
    houses ||--o{ quotations : "prices"
    employees ||--o{ leads : "assigned to"
    customers ||--o{ customer_family_members : "has"
    houses ||--o{ reservations : "holds"
    customers ||--o{ reservations : "reserves"
    reservations ||--o| bookings : "confirms"
    bookings ||--o| sales_contracts : "binds"
    sales_contracts ||--o| payment_plans : "allocates"
    payment_plans ||--o{ installments : "schedules"
    sales_contracts ||--o{ commissions : "pays"
    employees ||--o{ commissions : "agent"

    %% Warranty & Document Tables
    houses ||--o| warranties : "covers"
    customers ||--o{ warranties : "holds"
    warranties ||--o{ maintenance_requests : "logs"
    customers ||--o{ maintenance_requests : "reports"
    maintenance_requests ||--o{ repair_records : "tracks"
    employees ||--o{ repair_records : "assigned"
    users ||--o{ documents : "uploads"
```

---

## 🔑 Key Relationships Details

1. **Multi-Tenancy Root**: Almost all core entities (`projects`, `users`, `employees`, `suppliers`, `purchase_orders`, `invoices`, `expenses`, `leads`, `customers`, `documents`, `notifications`) reference the `companies` table via `company_id` for row-level logical multi-tenant isolation.
2. **Polymorphic Invoices**: The `invoices` table supports polymorphic contacts (`contact_id`, `contact_type`) allowing single-table invoicing to both Customers (Receivable) and Suppliers/Contractors (Payable).
3. **Polymorphic Documents**: The `documents` table maps to any auditable or physical entity (Villas, Purchase Orders, Inspection Reports, Sales Contracts) using polymorphic parameters (`documentable_id`, `documentable_type`).
4. **Subdivision Hierarchies**: `Lands` are subdivided into `Blocks`, which are subdivided into `Lots`, where a single `House` is constructed.
