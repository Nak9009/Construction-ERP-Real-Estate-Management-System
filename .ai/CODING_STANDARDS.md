# CODING_STANDARDS.md

## Purpose
This document establishes the strict coding standards and conventions for the Construction ERP system. Adherence ensures readability, maintainability, and consistency across the large, diverse engineering team.

## Scope
Defines standards for Laravel (PHP), Next.js (TypeScript/React), file naming, and documentation.

## TypeScript & React Standards

### General TypeScript
- **Strict Mode**: `strict: true` must be enabled in `tsconfig.json`.
- **No `any`**: The use of `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, then perform type narrowing.
- **Interfaces vs Types**: Use `interface` for object shapes and class contracts. Use `type` aliases for unions, intersections, and primitive type aliases.
- **Enums**: Avoid TypeScript `enum`. Use union types (e.g., `type Status = 'active' | 'inactive';`) or const objects.

### React Components
- **Functional Components**: All components must be functional. Do not use class components.
- **Props**: Export a `Props` interface for every component.
  ```typescript
  export interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  export function Button({ label, onClick }: ButtonProps) { ... }
  ```
- **Server vs Client**: Clearly separate Next.js Server Components from Client Components. Minimize `"use client"` directives; push them down the tree to the specific interactive elements.
- **State Management**:
  - Local state: `useState`, `useReducer`.
  - Server state / Data Fetching: `TanStack Query` (React Query).
  - Global UI state (Auth, Themes): `Zustand`.

### Naming Conventions (Frontend)
- **Files**: PascalCase for components (`UserProfile.tsx`). camelCase for utilities and hooks (`useProjects.ts`, `formatDate.ts`).
- **Variables/Functions**: camelCase.
- **Interfaces**: PascalCase, do NOT prefix with `I` (e.g., use `User`, not `IUser`).
- **Hooks**: Must start with `use`.

## Laravel & PHP Standards

### General PHP
- **Version**: PHP 8.4+. Leverage modern features like constructor property promotion, match expressions, named arguments, and readonly properties.
- **Types**: Strict typing is mandatory. Add `declare(strict_types=1);` to the top of all PHP files. Use scalar type hints and return types for every method.

### Laravel Architecture Standards
- **Controllers**: Must be extremely thin. They only receive the HTTP Request, pass data to an Action or Service, and return a Resource.
- **Requests (FormRequests)**: All validation must happen in a dedicated FormRequest class.
- **DTOs (Data Transfer Objects)**: Use DTOs to pass complex data structures between Controllers and Actions.
- **Actions/Services**: 
  - Use Actions for single-responsibility operations (e.g., `CreateInvoiceAction`). 
  - An Action should typically have a single public method like `execute()` or `handle()`.
- **Resources (API Resources)**: Always use Eloquent API Resources to format JSON responses. Never return Eloquent models directly from a controller.
- **Events & Listeners**: Use events for side effects. For example, `OrderPlacedEvent` triggers `SendOrderConfirmationListener` and `UpdateInventoryListener`.
- **Jobs**: Push heavy processing (e.g., PDF generation, complex calculations) to RabbitMQ via queued Jobs.

### Naming Conventions (Backend)
- **Classes**: PascalCase (`UserController`).
- **Methods**: camelCase (`createUser()`).
- **Variables**: camelCase (`$activeUsers`).
- **Database Tables**: snake_case, plural (`inventory_items`).
- **Database Columns**: snake_case (`created_at`, `project_id`).

## Folder Conventions
### Frontend (Next.js)
```text
src/
├── app/               # Next.js App Router pages and layouts
├── components/
│   ├── ui/            # shadcn/ui generic components
│   └── layout/        # Global layout components (Sidebar, TopNav)
├── features/          # Feature-based architecture
│   └── [feature]/     # e.g., 'inventory', 'sales'
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── lib/               # Utility functions, axios clients, zustand stores
└── types/             # Global TypeScript types
```

### Backend (Laravel)
```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Domain/            # Clean Architecture Domain Logic
│   └── [Context]/     # e.g., 'Inventory', 'Finance'
│       ├── Actions/
│       ├── DTOs/
│       ├── Events/
│       └── Exceptions/
└── Providers/
```

## Import Ordering
Group imports consistently:
1. Built-in modules / React core.
2. Third-party packages.
3. Internal aliases (e.g., `@/components/...`).
4. Relative imports (`./`, `../`).

## Linting & Formatting
- **Frontend**: ESLint and Prettier must be configured and pass in CI.
- **Backend**: Laravel Pint or PHP CS Fixer must be used to enforce PSR-12 and Laravel coding standards.

## Documentation & Comments
- **Code Comments**: Explain *why*, not *what*. The code itself should explain *what* it is doing through clear variable and method naming.
- **DocBlocks**: Required for complex backend Action classes or complex TypeScript utility functions. Avoid redundant DocBlocks that just restate the type hints.

## Error Handling & Logging
- Do not use `try/catch` block structures to manage control flow. 
- Log meaningful errors using `Log::error()` in Laravel with context arrays, or `console.error()` on the frontend. Ensure PII is stripped.
