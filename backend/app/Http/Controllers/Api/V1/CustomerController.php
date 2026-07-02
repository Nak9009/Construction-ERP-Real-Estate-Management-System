<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Customer\Models\Customer;
use App\Domain\Customer\Models\CustomerFamilyMember;
use App\Domain\Customer\Models\PaymentPlan;
use App\Domain\Customer\Models\Installment;
use App\Http\Resources\Api\V1\CustomerResource;
use App\Http\Resources\Api\V1\CustomerFamilyMemberResource;
use App\Http\Resources\Api\V1\PaymentPlanResource;
use App\Http\Resources\Api\V1\InstallmentResource;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $this->authorize('view_customers');
        
        $customers = Customer::orderBy('created_at', 'desc')->get();
        return CustomerResource::collection($customers);
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request)
    {
        $this->authorize('create_customers');

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:customers,email',
            'phone' => 'nullable|string|max:255',
            'identity_card_number' => 'nullable|string|max:255',
            'passport_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'nationality' => 'nullable|string|max:255',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => new CustomerResource($customer)
        ], 201);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer)
    {
        $this->authorize('view_customers');
        
        return new CustomerResource($customer->load(['familyMembers', 'paymentPlans']));
    }

    /**
     * Add a family member to customer.
     */
    public function addFamilyMember(Request $request, Customer $customer)
    {
        $this->authorize('update_customers');

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'relationship' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'identity_card_number' => 'nullable|string|max:255',
        ]);

        $member = $customer->familyMembers()->create($validated);

        return response()->json([
            'message' => 'Family member added successfully',
            'family_member' => new CustomerFamilyMemberResource($member)
        ], 201);
    }

    /**
     * Store a payment plan.
     */
    public function storePaymentPlan(Request $request)
    {
        $this->authorize('manage_payment_plans');

        $validated = $request->validate([
            'customer_id' => 'required|uuid|exists:customers,id',
            'sales_contract_id' => 'nullable|uuid|exists:sales_contracts,id',
            'total_amount' => 'required|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'interest_rate' => 'nullable|numeric|min:0',
            'duration_months' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'status' => 'nullable|string|in:active,completed,defaulted,cancelled',
        ]);

        $plan = PaymentPlan::create($validated);

        return response()->json([
            'message' => 'Payment plan created successfully',
            'payment_plan' => new PaymentPlanResource($plan)
        ], 201);
    }

    /**
     * Log an installment payment.
     */
    public function logInstallment(Request $request)
    {
        $this->authorize('manage_installments');

        $validated = $request->validate([
            'payment_plan_id' => 'required|uuid|exists:payment_plans,id',
            'amount_due' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'paid_date' => 'nullable|date',
            'status' => 'nullable|string|in:pending,paid,overdue,partial',
        ]);

        $installment = Installment::create($validated);

        return response()->json([
            'message' => 'Installment logged successfully',
            'installment' => new InstallmentResource($installment)
        ], 201);
    }
}
