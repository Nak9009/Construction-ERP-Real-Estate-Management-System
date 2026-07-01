# 🏗️ Construction ERP & Real Estate Management System

A modern, scalable, cloud-native Construction ERP for managing the complete lifecycle of housing developments — from land acquisition through planning, construction, sales, warranty, and maintenance.

## 🏛️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend API** | Laravel 13 / PHP 8.4 | REST API, Business Logic, Queue Workers |
| **Frontend** | Next.js 15 / React 19 | Web Dashboard & Management UI |
| **Mobile** | Flutter | Engineer & Customer Apps |
| **AI Service** | FastAPI / Python | Predictions, Computer Vision |
| **Database** | MySQL 8.0 | Primary Data Store |
| **Cache** | Redis 7 | Caching, Sessions, Real-time |
| **Queue** | RabbitMQ 3 | Async Job Processing |
| **Storage** | S3 / MinIO | File & Document Storage |

## 📦 Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | Dashboard | Widgets, charts, KPIs |
| 2 | Company | Multi-tenant company management |
| 3 | Project | Project lifecycle management |
| 4 | Land | Land acquisition & subdivision |
| 5 | Block | Block organization |
| 6 | Lot | Lot tracking & status |
| 7 | House | House types, pricing, blueprints |
| 8 | Construction | Stage-based construction tracking |
| 9 | Timeline | Gantt, Kanban, Calendar views |
| 10 | Workforce | Employees, contractors, attendance |
| 11 | Equipment | Heavy equipment tracking |
| 12 | Warehouse | Material inventory management |
| 13 | Procurement | Suppliers, POs, RFQs |
| 14 | Financial | Budget, invoices, payments |
| 15 | Sales | Leads, quotations, contracts |
| 16 | Customer | Customer management, installments |
| 17 | Inspection | Quality checklists & approvals |
| 18 | Warranty | Warranty & maintenance requests |
| 19 | Documents | Document management system |
| 20 | Notifications | Multi-channel notifications |
| 21 | Reports | PDF/Excel report generation |
| 22 | Analytics | Cost, budget, delay analysis |
| 23 | AI | Predictive analytics (future) |

## 🚀 Quick Start

### Prerequisites

- PHP 8.3+
- Composer 2.x
- Node.js 20.9+
- Docker & Docker Compose

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd Construction-ERP-Real-Estate-Management-System

# Start infrastructure services
make up

# Setup backend
make backend-setup

# Setup frontend
make frontend-setup

# Seed demo data
make seed

# Open in browser
# Backend API:  http://localhost:8000
# Frontend:     http://localhost:3000
# RabbitMQ UI:  http://localhost:15672
# MinIO Console: http://localhost:9001
# Mailpit:      http://localhost:8025
```

### Development Commands

```bash
make up              # Start Docker services
make down            # Stop Docker services
make backend-setup   # Install backend dependencies & migrate
make frontend-setup  # Install frontend dependencies
make migrate         # Run database migrations
make seed            # Seed demo data
make test            # Run all tests
make lint            # Run linters
make fresh           # Fresh migrate + seed
```

## 📁 Project Structure

```
├── backend/          # Laravel 13 API
├── frontend/         # Next.js 15 Web App
├── mobile/           # Flutter App (Phase 2)
├── ai-service/       # FastAPI AI Service (Phase 3)
├── docs/             # Architecture documentation
├── docker/           # Docker configurations
├── docker-compose.yml
├── Makefile
└── README.md
```

## 🔐 Security

- Role-Based Access Control (RBAC) with granular permissions
- Multi-Factor Authentication (MFA)
- JWT + OAuth2 authentication
- Encryption at rest and in transit
- Complete audit trail
- Rate limiting

## 📊 Scalability

Designed to support:
- 1,000+ Companies
- 10,000+ Projects
- 100,000+ Houses
- Millions of documents and progress records
- Horizontal scaling & microservices-ready

## 📄 License

MIT License
