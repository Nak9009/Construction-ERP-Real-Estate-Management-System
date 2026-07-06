# TESTING.md

## Purpose
This document establishes the comprehensive testing strategy for the ERP system. It ensures high code quality, prevents regressions, and guarantees that business logic behaves exactly as expected before reaching production.

## Testing Strategy & Layers

### 1. Backend (Laravel / PHP)

#### Unit Tests
- **Scope**: Isolated domain logic, actions, value objects, and utility classes.
- **Rule**: Must not touch the database, filesystem, or external APIs. Use mocking (`Mockery`) extensively.
- **Execution**: Should run in milliseconds.

#### Feature Tests
- **Scope**: API endpoints, database interactions, controllers, and complex jobs.
- **Rule**: Uses an in-memory SQLite database or a dedicated testing MySQL database. Database transactions are used to roll back state after each test.
- **Tools**: Laravel's built-in `TestCase`, `RefreshDatabase` trait.

#### Integration Tests
- **Scope**: Third-party API integrations (e.g., Payment gateways, external HR systems).
- **Rule**: Use Laravel’s `Http::fake()` to mock responses during standard testing, but maintain a separate test suite for live integration testing against sandbox environments.

### 2. Frontend (Next.js / React)

#### Component Tests
- **Scope**: Individual React components (e.g., Shadcn UI custom implementations, complex forms).
- **Tools**: React Testing Library + Vitest or Jest.
- **Rule**: Test behavior (clicking, typing) and accessibility (ARIA roles), not implementation details or internal state.

#### Hook Tests
- **Scope**: Custom React hooks (`useInventory.ts`, `useAuth.ts`).
- **Tools**: `@testing-library/react-hooks`.

### 3. End-to-End (E2E) Testing
- **Scope**: Critical user journeys (e.g., "Create a Project -> Add a Block -> Sell a House -> Generate Invoice").
- **Tools**: Playwright or Cypress.
- **Rule**: Runs against a fully seeded staging environment. Tests the entire stack (Frontend -> API -> Database -> AI Services).

## Test Data Management

### Factories & Seeders
- **Factories**: Define a blueprint for every Eloquent model to generate realistic dummy data using Faker. Ensure relationships can be instantiated seamlessly.
- **Seeders**: Provide deterministic datasets for staging environments and E2E testing. 

## Coverage Requirements
- **Core Domain Logic**: 100% statement coverage is expected for anything in the `Domain/` directory (Financial calculations, state transitions).
- **Overall Backend**: > 85% line coverage.
- **Frontend**: > 80% coverage for shared components and critical feature hooks.

## CI/CD Test Pipeline
- Tests must be executed on every Pull Request via GitHub Actions.
- The pipeline will fail (and block merging) if:
  1. Any test fails.
  2. Test coverage drops below the required threshold.
  3. Static analysis tools (PHPStan for backend, TypeScript compiler for frontend) report errors.
  4. Linter checks (Pint, ESLint) fail.

## Best Practices
- **AAA Pattern**: Structure tests using Arrange, Act, Assert.
- **Descriptive Names**: Test names should describe the scenario and expected outcome. E.g., `it_prevents_selling_a_house_that_is_already_sold()`.
- **Avoid Sleep**: Never use `sleep()` in tests. Use robust waiting mechanisms (e.g., Playwright's auto-wait) or time-traveling (Laravel's `Carbon::setTestNow()`).
