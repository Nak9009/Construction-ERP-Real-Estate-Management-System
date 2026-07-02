<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Financial\Models\Budget;
use App\Domain\Financial\Models\Expense;
use App\Domain\Financial\Models\Invoice;
use App\Domain\Financial\Models\Payment;
use App\Http\Resources\Api\V1\BudgetResource;
use App\Http\Resources\Api\V1\ExpenseResource;
use App\Http\Resources\Api\V1\InvoiceResource;
use App\Http\Resources\Api\V1\PaymentResource;

class FinancialController extends Controller
{
    /**
     * Display a listing of budgets.
     */
    public function indexBudgets(Request $request)
    {
        $this->authorize('view_budgets');
        
        $budgets = Budget::orderBy('created_at', 'desc')->get();
        return BudgetResource::collection($budgets);
    }

    /**
     * Store a newly created budget.
     */
    public function storeBudget(Request $request)
    {
        $this->authorize('create_budgets');

        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $budget = Budget::create($validated);

        return response()->json([
            'message' => 'Budget created successfully',
            'budget' => new BudgetResource($budget)
        ], 201);
    }

    /**
     * Display a listing of expenses.
     */
    public function indexExpenses(Request $request)
    {
        $this->authorize('view_expenses');
        
        $expenses = Expense::orderBy('created_at', 'desc')->get();
        return ExpenseResource::collection($expenses);
    }

    /**
     * Store a newly created expense.
     */
    public function storeExpense(Request $request)
    {
        $this->authorize('create_expenses');

        $validated = $request->validate([
            'project_id' => 'nullable|uuid|exists:projects,id',
            'budget_id' => 'nullable|uuid|exists:budgets,id',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'receipt_photo' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,approved,rejected',
        ]);

        $expense = Expense::create($validated);

        return response()->json([
            'message' => 'Expense created successfully',
            'expense' => new ExpenseResource($expense)
        ], 201);
    }

    /**
     * Generate an invoice.
     */
    public function storeInvoice(Request $request)
    {
        $this->authorize('create_invoices');

        $validated = $request->validate([
            'customer_id' => 'required|uuid|exists:customers,id',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'invoice_number' => 'required|string|max:255|unique:invoices,invoice_number',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'amount' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:draft,sent,paid,overdue,cancelled',
        ]);

        $invoice = Invoice::create($validated);

        return response()->json([
            'message' => 'Invoice generated successfully',
            'invoice' => new InvoiceResource($invoice)
        ], 201);
    }

    /**
     * Record a payment.
     */
    public function storePayment(Request $request)
    {
        $this->authorize('create_payments');

        $validated = $request->validate([
            'invoice_id' => 'nullable|uuid|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,bank_transfer,credit_card,cheque',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::create($validated);

        if (!empty($validated['invoice_id'])) {
            $invoice = Invoice::find($validated['invoice_id']);
            // If amount paid covers the invoice, update status (simplified logic)
            if ($payment->amount >= $invoice->amount) {
                $invoice->update(['status' => 'paid']);
            }
        }

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => new PaymentResource($payment)
        ], 201);
    }
}
