# Finance Skill

## Module Overview
The Finance module acts as the core accounting ledger for the entire ERP. It manages Accounts Payable (AP), Accounts Receivable (AR), general ledgers, budgets, and project costing.

## Responsibilities
- Track real-time budget vs. actuals for every Project.
- Process incoming payments (AR) from Customers.
- Process outgoing payments (AP) to Vendors.
- Maintain a double-entry accounting ledger.

## Business Rules
- **Double-Entry**: Every financial transaction must have balancing debit and credit entries in the general ledger.
- Transactions logged to the general ledger are immutable. To correct an error, a reversing journal entry must be created.
- A Project budget cannot be exceeded without an approved Budget Revision.

## User Roles & Permissions
- **Accountant**: Can process AP/AR and journal entries.
- **Financial Controller/CFO**: Can approve large payments, close fiscal periods.
- **Project Manager**: Read-only access to their specific project's financial summary.

## Database Entities
- `accounts` (Chart of Accounts)
  - `id` (UUID)
  - `code` (String, e.g., '1000')
  - `name` (String, e.g., 'Cash')
  - `type` (Enum: asset, liability, equity, revenue, expense)
- `journal_entries`
  - `id` (UUID)
  - `date` (Date)
  - `description` (String)
  - `reference_type` (String)
  - `reference_id` (UUID)
- `journal_lines`
  - `entry_id` (UUID)
  - `account_id` (UUID)
  - `debit` (BigInteger, Cents)
  - `credit` (BigInteger, Cents)
- `invoices` (AR / AP)
  - `id` (UUID)
  - `type` (Enum: receivable, payable)
  - `amount` (BigInteger)
  - `status` (Enum: draft, issued, paid, overdue)

## APIs
- `GET /api/v1/finance/accounts`
- `GET /api/v1/finance/invoices`
- `POST /api/v1/finance/invoices/{id}/pay`

## UI Pages
- **`/finance/dashboard`**: High-level P&L, Cash Flow overview.
- **`/finance/invoices`**: Data Table of AR/AP.
- **`/finance/ledger`**: View the general ledger.

## shadcn/ui Components to Use
- `Data Table`: For invoices and ledger entries.
- `Tabs`: To quickly switch between Receivables and Payables.
- `Dialog`: For the "Process Payment" workflow.

## Backend Architecture
- **Financial Integrity**: All ledger entries must be wrapped in strict DB transactions.
- Never use floats for currency. Use the `BigInteger` column type representing the smallest currency unit (cents). Use the `moneyphp/money` library in Laravel to handle arithmetic safely.

## Frontend Architecture
- Format all currency outputs using a standardized utility function that utilizes `Intl.NumberFormat`.

## Testing Requirements
- **Ledger Balance**: Ensure a unit test verifies that attempting to save an unbalanced journal entry (Debits != Credits) throws a Domain Exception.
