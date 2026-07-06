# SECURITY.md

## Purpose
This document outlines the strict security protocols for the Construction ERP system. Security is a non-negotiable priority, operating on a Zero-Trust principle across the entire stack.

## Identity and Access Management

### 1. Authentication
- **Token-Based Auth**: The API relies on stateless JWTs (JSON Web Tokens) or Laravel Sanctum API tokens.
- **MFA/2FA**: Multi-Factor Authentication is mandatory for high-privilege roles (Admins, Financial Controllers).
- **Session Lifetimes**: Short-lived access tokens coupled with secure, HTTP-only refresh tokens.
- **Rate Limiting**: Strict rate limits on authentication endpoints to prevent brute-force attacks.

### 2. Authorization (RBAC & ABAC)
- **Role-Based Access Control (RBAC)**: Users are assigned Roles (e.g., `SiteManager`, `Accountant`).
- **Attribute-Based Access Control (ABAC)**: Roles alone are insufficient. We must verify ownership or project assignment. Example: A `SiteManager` can only update tasks on Projects they are explicitly assigned to.
- **Implementation**: Enforce entirely within Laravel Policies. Never scatter authorization logic across controllers or services.

## Application Security

### 1. Input Validation and Output Encoding
- **Validation**: All incoming API requests must be validated against a strict schema using Laravel FormRequests. Never trust client data.
- **Sanitization**: Strip malicious payloads before processing (e.g., XSS vectors in HTML inputs).
- **Encoding**: React (Next.js) handles context-aware output encoding automatically. Do not use `dangerouslySetInnerHTML` without a robust sanitizer like DOMPurify.

### 2. SQL Injection Prevention
- Use Laravel’s Eloquent ORM or Query Builder for all database interactions, which use PDO parameter binding natively.
- **Never** concatenate user input directly into a `DB::raw()` query.

### 3. File Uploads
- **Validation**: Strict validation of MIME types and file extensions. Do not rely solely on the extension; check the magic bytes.
- **Storage**: Uploaded files must be stored in isolated S3 buckets, not on the application server.
- **Access**: Sensitive files (Contracts, Invoices) require presigned S3 URLs that expire after a short duration (e.g., 5 minutes) rather than public URLs.

## Data Security

### 1. Encryption at Rest
- Sensitive database fields (e.g., SSNs, banking details) must be encrypted using Laravel's `Crypt` facade before storage.
- Storage volumes (RDS, EBS) and S3 buckets must be encrypted using KMS keys.

### 2. Secrets Management
- Hardcoding secrets in the codebase is a critical violation.
- All secrets (API keys, database passwords) must be injected via environment variables at runtime.
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for production environments.

### 3. Audit Trails
- All mutating actions (`POST`, `PUT`, `PATCH`, `DELETE`) on critical entities must log the action, the exact fields changed (before/after state), the User ID, and the IP address.
- These logs are immutable and stored in a specialized `audit_logs` table or sent directly to an external logging service (e.g., Loki or ELK).

## Network & Infrastructure Security
- **HTTPS Only**: Enforced via HSTS. No HTTP traffic is allowed.
- **CORS**: Strict Cross-Origin Resource Sharing policies. Only trusted domains (the Next.js frontend, the mobile app API gateway) are permitted.
- **WAF**: Deploy a Web Application Firewall to block common OWASP Top 10 exploits, DDoS attempts, and known malicious IPs.
- **VPC Isolation**: The database and cache layers must reside in private subnets with no direct inbound internet access.

## Best Practices
- **Principle of Least Privilege**: Services, IAM roles, and database users should only have the permissions strictly necessary to perform their job.
- **Dependency Scanning**: CI/CD pipelines must include automated vulnerability scanning for npm packages (Frontend) and Composer packages (Backend) using tools like Snyk or Dependabot.
