# DEPLOYMENT.md

## Purpose
This document outlines the infrastructure, deployment strategies, and operational monitoring required to run the Construction ERP system in a highly available production environment.

## Infrastructure Architecture

### Core Components
- **Containerization**: Docker is used across the entire stack.
- **Orchestration**: Kubernetes (K8s) manages the deployment, scaling, and networking of the containers.
- **Ingress**: Nginx Ingress Controller routes external traffic to the appropriate K8s services (Frontend, API Gateway).

### Stateful Services
- **Database**: Managed MySQL Cluster (e.g., AWS RDS Aurora) for high availability and automated failover.
- **Cache**: Managed Redis cluster (e.g., AWS ElastiCache) for session management, queuing, and caching.
- **Message Broker**: RabbitMQ for robust, persistent asynchronous job queuing.
- **Object Storage**: AWS S3 (or compatible API) for storing user uploads, documents, and backups.

## CI/CD Pipeline (GitHub Actions)

### 1. Continuous Integration (CI)
Triggered on every PR and commit to `main`.
- Lints code (ESLint, Laravel Pint).
- Runs static analysis (TypeScript, PHPStan).
- Executes unit and feature test suites.
- Builds Docker images and scans for vulnerabilities.

### 2. Continuous Deployment (CD)
Triggered on tagged releases or merges to `main`.
- Pushes validated Docker images to the Container Registry (e.g., AWS ECR).
- Updates Kubernetes manifests via Helm or Kustomize.

## Deployment Strategies

### Zero Downtime Deployment
- **Rolling Updates**: K8s gradually replaces old pods with new ones, ensuring at least N pods are always available to serve traffic.
- **Database Migrations**: Migrations must be backward-compatible. Run migrations as a pre-deployment hook or K8s Job before the application containers switch over. Do not drop columns or tables until a subsequent release.

### Blue/Green Deployment (Optional, for Major Releases)
- A complete secondary environment (Green) is spun up alongside the primary (Blue).
- Traffic is switched at the Ingress level once the Green environment is fully validated.

## Scaling Strategy
- **Horizontal Pod Autoscaling (HPA)**: The Laravel API and Next.js frontend automatically scale out (add more pods) based on CPU/Memory utilization or custom metrics (e.g., high queue backlog).
- **Database Read Replicas**: Direct heavy read queries (e.g., complex analytical reports) to read replicas to protect the primary writer database.

## Observability & Monitoring

### 1. Metrics (Prometheus & Grafana)
- **Infrastructure**: CPU, Memory, Disk IO, Network.
- **Application**: HTTP response times, error rates (4xx, 5xx), queue lengths, active database connections.

### 2. Logging (Loki)
- All container logs (stdout/stderr) are aggregated into Loki.
- Logs are strictly JSON formatted for easy querying.
- Alerts are configured for critical errors (e.g., database connection drops, unhandled exceptions).

### 3. Application Performance Monitoring (APM)
- Integrate an APM tool (e.g., Datadog, New Relic, or Sentry) for distributed tracing across the Next.js frontend, Laravel API, and Python AI services.

## Disaster Recovery
- **Backups**: Automated daily snapshots of the database and S3 buckets. Transaction logs retained to allow Point-in-Time Recovery (PITR).
- **RTO/RPO**: The Recovery Time Objective is < 2 hours. The Recovery Point Objective is < 5 minutes (due to PITR).
- **Redundancy**: The K8s cluster and database must span multiple Availability Zones (Multi-AZ) to survive a datacenter failure.
