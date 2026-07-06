# Prompt: Generate Enterprise AI Engineering Documentation for Construction ERP

## Role

You are a Principal Enterprise Software Architect, Solution Architect, Technical Lead, and Staff Full Stack Engineer with over 20 years of experience designing enterprise ERP platforms.

Your task is **NOT** to generate application code.

Instead, generate a complete AI engineering knowledge base that will guide AI coding assistants (ChatGPT, Codex, Claude Code, Cursor, GitHub Copilot, Windsurf, etc.) throughout the entire development lifecycle.

The documentation should become the project's permanent engineering standards.

---

# Project

Build a cloud-native Construction ERP & Real Estate Management System.

Technology Stack

Backend

- Laravel 13
- PHP 8.4
- MySQL
- Redis
- RabbitMQ
- S3 Storage

Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Zustand
- Recharts
- Framer Motion
- next-intl

Mobile

- Flutter

AI Services

- Python
- FastAPI
- OpenCV
- PyTorch

Infrastructure

- Docker
- Kubernetes
- Nginx
- GitHub Actions
- Prometheus
- Grafana
- Loki

---

# Primary Goal

Generate professional engineering documentation that ensures every AI assistant produces consistent, production-ready code.

The documentation should be suitable for large enterprise teams and support long-term maintenance.

---

# Output Structure

Generate the following directory exactly.

```text
.ai/
│
├── AGENTS.md
├── ARCHITECTURE.md
├── UI_GUIDELINES.md
├── CODING_STANDARDS.md
├── DATABASE.md
├── API.md
├── SECURITY.md
├── TESTING.md
├── DEPLOYMENT.md
│
└── skills/
    ├── dashboard.md
    ├── company.md
    ├── branch.md
    ├── project.md
    ├── land.md
    ├── block.md
    ├── lot.md
    ├── house.md
    ├── construction.md
    ├── timeline.md
    ├── workforce.md
    ├── equipment.md
    ├── warehouse.md
    ├── procurement.md
    ├── finance.md
    ├── sales.md
    ├── customer.md
    ├── inspection.md
    ├── warranty.md
    ├── documents.md
    ├── notifications.md
    ├── analytics.md
    ├── reports.md
    ├── ai.md
    ├── mobile.md
    └── permissions.md
```

---

# Requirements for Every Document

Each markdown file must include:

- Purpose
- Responsibilities
- Scope
- Design Principles
- Best Practices
- Architecture Decisions
- Folder Structure
- Naming Conventions
- Examples
- Common Mistakes
- Anti-Patterns
- Code Guidelines
- Future Expansion
- References to related documents

Each document should be written as production-quality engineering documentation.

---

# AGENTS.md

This is the master document.

Include:

- Project overview
- AI behavior rules
- Development workflow
- Coding philosophy
- Enterprise architecture principles
- SOLID
- DRY
- KISS
- YAGNI
- Clean Architecture
- DDD
- Modular Monolith
- Microservice-ready boundaries
- Code review expectations
- Git workflow
- Commit conventions
- Pull request checklist
- Error handling strategy
- Logging strategy
- Performance expectations
- Security expectations

Frontend rules:

The entire UI must use shadcn/ui.

Never build custom components when an equivalent shadcn component exists.

Always use:

- Button
- Card
- Dialog
- Sheet
- Drawer
- Tabs
- Accordion
- Form
- Input
- Select
- Combobox
- Table
- Data Table
- Badge
- Avatar
- Alert
- Calendar
- Tooltip
- Popover
- Dropdown Menu
- Navigation Menu
- Sidebar
- Command
- Toast
- Skeleton
- Pagination

Dark mode must always be supported.

Accessibility is mandatory.

---

# ARCHITECTURE.md

Document:

- Clean Architecture
- Domain-Driven Design
- Bounded Contexts
- Aggregates
- Entities
- Value Objects
- Domain Events
- Application Layer
- Infrastructure Layer
- Repository Pattern
- CQRS (where appropriate)
- Event Bus
- Queue Architecture
- Caching Strategy
- Service Boundaries
- Modular Monolith
- Migration path to Microservices

Include architecture diagrams using Mermaid.

---

# UI_GUIDELINES.md

Define the enterprise design system.

Include:

- Typography
- Colors
- Spacing
- Grid
- Breakpoints
- Responsive rules
- Dark mode
- Icons
- Forms
- Tables
- Charts
- Dashboard layout
- Sidebar
- Header
- Navigation
- Empty states
- Loading states
- Error states
- Success states
- Skeleton loaders
- Toast notifications
- Motion guidelines

Enforce:

100% shadcn/ui.

No custom UI unless absolutely necessary.

Document exactly which shadcn components should be used for every scenario.

---

# CODING_STANDARDS.md

Include standards for:

Laravel

- Controllers
- Services
- Actions
- DTOs
- Requests
- Policies
- Resources
- Events
- Jobs
- Listeners

TypeScript

- Strict mode
- No any
- Generic types
- Utility types
- Interfaces
- Type aliases

React

- Server Components
- Client Components
- Hooks
- Context
- Zustand
- TanStack Query

Naming conventions

Folder conventions

Import ordering

File naming

Linting

Formatting

Documentation

Comments

Error handling

Logging

---

# DATABASE.md

Document:

- Naming conventions
- UUID primary keys
- Foreign keys
- Composite indexes
- Soft deletes
- Audit fields
- Tenant isolation
- Partitioning
- Index strategy
- Transactions
- Constraints
- Performance optimization

Generate database conventions suitable for millions of records.

---

# API.md

Define REST API standards.

Include:

- Versioning
- Authentication
- Authorization
- Request validation
- Response format
- Error format
- Pagination
- Filtering
- Sorting
- Searching
- Cursor pagination
- Bulk APIs
- Rate limiting
- Swagger/OpenAPI conventions

Provide example requests and responses.

---

# SECURITY.md

Document:

- JWT
- OAuth2
- RBAC
- MFA
- Audit Trail
- Activity Log
- Encryption
- Secrets Management
- Password Policy
- API Security
- CSRF
- XSS
- SQL Injection
- File Upload Security
- Backup
- Disaster Recovery

---

# TESTING.md

Testing strategy:

Laravel

- Unit tests
- Feature tests
- Integration tests

Next.js

- Component tests
- Hook tests
- UI tests

End-to-End

- Playwright

Coverage requirements

Mocking strategy

Factories

Seeders

CI test pipeline

---

# DEPLOYMENT.md

Document:

Docker

Kubernetes

Ingress

Nginx

Redis

RabbitMQ

S3

GitHub Actions

Blue/Green deployment

Rolling deployment

Zero downtime deployment

Monitoring

Prometheus

Grafana

Loki

Scaling

Disaster recovery

---

# Skills

Generate one markdown document for every business module.

Every skill document must include:

- Module overview
- Responsibilities
- Business rules
- User roles
- Permissions
- Database entities
- Relationships
- APIs
- Validation rules
- Events
- Workflows
- UI pages
- shadcn/ui components to use
- Backend architecture
- Frontend architecture
- Mobile considerations
- Reporting
- Notifications
- Audit requirements
- Testing requirements
- Future improvements

Example modules:

- Dashboard
- Company
- Branch
- Project
- Land
- Block
- Lot
- House
- Construction
- Timeline
- Workforce
- Equipment
- Warehouse
- Procurement
- Finance
- Sales
- Customer
- Inspection
- Warranty
- Documents
- Reports
- Analytics
- Notifications
- AI

---

# Documentation Quality

The generated markdown should read like official engineering documentation from a large technology company.

Do not write short summaries.

Every document should be comprehensive, detailed, and implementation-oriented.

Use:

- Markdown headings
- Tables
- Mermaid diagrams
- Decision records
- Examples
- Checklists
- Best practices
- Anti-patterns
- Enterprise recommendations

Assume this documentation will be used for years by engineers and AI coding assistants. Optimize for clarity, consistency, scalability, maintainability, and long-term evolution.
