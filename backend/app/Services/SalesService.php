<?php

namespace App\Services;

use App\Domain\Sales\Models\SalesContract;
use App\Domain\Sales\Models\Commission;
use App\Domain\Financial\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SalesService
{
    /**
     * Process a newly created sales contract.
     * Generates installments and calculates commission.
     */
    public function processNewContract(SalesContract $contract)
    {
        DB::transaction(function () use ($contract) {
            $this->generateInstallments($contract);
            $this->calculateCommission($contract);
        });
    }

    /**
     * Generate installment invoices based on contract terms.
     */
    protected function generateInstallments(SalesContract $contract)
    {
        // For simplicity in this demo service, we will hardcode terms since the actual schema
        // uses a separate `payment_plans` table. In a real scenario, we'd query $contract->paymentPlan.
        $downPayment = 20000;
        $numberOfInstallments = 10;
        
        $totalFinanced = $contract->total_amount - $downPayment;
        $monthlyAmount = $numberOfInstallments > 0 ? $totalFinanced / $numberOfInstallments : 0;

        // Generate down payment invoice immediately
        if ($downPayment > 0) {
            Invoice::create([
                'id' => (string) Str::uuid(),
                'company_id' => Str::uuid(),
                'contact_id' => Str::uuid(), // In a real scenario, $contract->booking->reservation->customer_id
                'contact_type' => 'customer',
                'sales_contract_id' => $contract->id,
                'invoice_number' => 'INV-DP-' . $contract->contract_number,
                'amount' => $downPayment,
                'due_date' => Carbon::now(),
                'status' => 'pending',
                'type' => 'receivable',
                'description' => 'Down payment for Contract ' . $contract->contract_number,
            ]);
        }

        // Generate future installment invoices
        for ($i = 1; $i <= $numberOfInstallments; $i++) {
            Invoice::create([
                'id' => (string) Str::uuid(),
                'company_id' => Str::uuid(),
                'contact_id' => Str::uuid(),
                'contact_type' => 'customer',
                'sales_contract_id' => $contract->id,
                'invoice_number' => 'INV-INST-' . $contract->contract_number . '-' . $i,
                'amount' => $monthlyAmount,
                'due_date' => Carbon::now()->addMonths($i),
                'status' => 'pending',
                'type' => 'receivable',
                'description' => "Installment {$i} of {$numberOfInstallments} for Contract " . $contract->contract_number,
            ]);
        }
    }

    /**
     * Calculate and record the sales agent commission.
     */
    protected function calculateCommission(SalesContract $contract)
    {
        // Defaulting to 2% flat rate for now as per plan
        $commissionRate = 0.02;
        $commissionAmount = $contract->total_amount * $commissionRate;

        // In a real scenario, the agent would be linked via the Booking or Customer
        $agentId = Str::uuid()->toString(); // Mocking for now

        if ($agentId) {
            Commission::create([
                'id' => (string) Str::uuid(),
                'sales_contract_id' => $contract->id,
                'agent_id' => $agentId,
                'amount' => $commissionAmount,
                'percentage' => $commissionRate * 100,
                'status' => 'pending',
                'notes' => 'Generated 2% commission from contract ' . $contract->contract_number,
            ]);
        }
    }
}
