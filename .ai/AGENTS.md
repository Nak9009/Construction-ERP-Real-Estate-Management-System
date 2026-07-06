# AGENTS.md

## Purpose
This document serves as the master engineering framework and knowledge base for the Construction ERP & Real Estate Management System. It outlines the foundational AI behavior rules, development workflows, coding philosophies, and enterprise architecture principles. 

## Scope
This standard applies to all AI coding assistants (e.g., Cursor, GitHub Copilot, Windsurf) and human engineers contributing to the codebase. It governs how code is authored, reviewed, and deployed across the full stack (Laravel Backend, Next.js Frontend, Flutter Mobile, Python AI Services).

## Project Overview
We are building a cloud-native Construction ERP & Real Estate Management System capable of handling millions of records, rigorous financial transactions, and complex construction workflows.

**Tech Stack:**
- **Backend**: Laravel 13, PHP 8.4, MySQL, Redis, RabbitMQ, S3
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query
- **Mobile**: Flutter
- **AI Services**: Python, FastAPI, OpenCV, PyTorch
- **Infrastructure**: Docker, Kubernetes, Nginx, GitHub Actions, Prometheus, Grafana, Loki

## AI Behavior Rules
1. **Zero Guesswork**: AI agents must adhere strictly to these guidelines. If a requirement is ambiguous, ask the human engineer for clarification before implementing.
2. **Context Awareness**: Always review the relevant `.ai/skills/*.md` file before generating code for a specific business module.
3. **No Unapproved Dependencies**: Never introduce new npm packages, Composer dependencies, or Python modules without explicit user permission.
4. **Shadcn UI Supremacy**: The entire React UI must use `shadcn/ui`. **Never** build custom components when an equivalent shadcn component exists.

## Enterprise Architecture Principles
Our architecture is designed for maintainability, testability, and horizontal scalability.
- **SOLID Principles**: Adhere strictly to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Clean Architecture & DDD**: Isolate domain logic from framework logic. Use Entities, Value Objects, and Domain Events.
- **Modular Monolith**: Build bounded contexts within the Laravel monolith to allow future seamless extraction into microservices if needed.
- **DRY & KISS**: Do Not Repeat Yourself. Keep It Simple, Stupid.
- **YAGNI**: You Aren't Gonna Need It. Do not over-engineer solutions for requirements that do not yet exist.

## Development Workflow
### Git Workflow
We use Trunk-Based Development with short-lived feature branches.
1. Branch naming: `feature/<module-name>-<short-desc>`, `bugfix/<issue-id>`, `hotfix/<issue-id>`.
2. Keep PRs small (under 400 lines of code changed) to ensure effective code reviews.

### Commit Conventions
Follow Conventional Commits:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

### Pull Request Checklist
- [ ] Code follows `CODING_STANDARDS.md`.
- [ ] Unit and Feature tests are passing.
- [ ] Test coverage for new logic is > 85%.
- [ ] No regression in performance metrics.
- [ ] UI changes comply with `UI_GUIDELINES.md` and support Dark Mode.

## Error Handling Strategy
- **Fail Fast**: Catch exceptions at the application boundary and return standardized HTTP responses.
- **Frontend**: Use React Error Boundaries at the feature level. Display standard `shadcn/ui` Alerts or Toasts for user-facing errors.
- **Backend**: Use Laravel's centralized exception handler. Return structured JSON responses (see `API.md`).

## Logging Strategy
- Use structured JSON logging. 
- Levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
- All logs must contain contextual IDs (e.g., `user_id`, `tenant_id`, `request_id`).
- Ensure no PII (Personally Identifiable Information) or secrets are ever logged.

## Performance & Security Expectations
- **Performance**: APIs must respond in < 200ms at the 95th percentile. Leverage Redis for caching frequently accessed data. Use database indexing appropriately.
- **Security**: Adopt a Zero-Trust model. Validate all inputs, sanitize all outputs. Implement RBAC for all endpoints (see `SECURITY.md`).

## Frontend Rules (Critical)
- **100% shadcn/ui**: Utilize standard components (Button, Card, Dialog, Table, Badge, Form, Select, etc.).
- **Dark Mode**: All designs must explicitly support seamless toggling between light and dark modes.
- **Accessibility (a11y)**: All interactive elements must be keyboard navigable and screen-reader compatible (ARIA attributes where necessary, but Radix UI handles most natively).

## References
- [Architecture Details](./ARCHITECTURE.md)
- [UI Guidelines](./UI_GUIDELINES.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Database Strategy](./DATABASE.md)
