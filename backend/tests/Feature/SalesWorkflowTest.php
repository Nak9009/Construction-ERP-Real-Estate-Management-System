<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Domain\Sales\Models\SalesContract;
use App\Domain\Sales\Models\Booking;
use App\Domain\Financial\Models\Invoice;
use App\Domain\Sales\Models\Commission;
use App\Services\SalesService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class SalesWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_contract_generates_installments_and_commission()
    {
        \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = OFF;');
        // 1. Arrange
        $booking = Booking::create([
            'id' => Str::uuid(),
            'reservation_id' => Str::uuid(),
            'customer_id' => Str::uuid(),
            'booking_number' => 'BKG-001',
            'booking_fee' => 1000,
            'booking_date' => now(),
            'status' => 'confirmed'
        ]);

        $contract = SalesContract::create([
            'id' => Str::uuid(),
            'booking_id' => $booking->id,
            'contract_number' => 'CTR-001',
            'total_amount' => 100000,
            'signed_at' => now(),
        ]);

        $salesService = new SalesService();

        // 2. Act
        $salesService->processNewContract($contract);

        // 3. Assert - Invoices
        // Should generate 1 down payment + 10 installments = 11 invoices
        $this->assertDatabaseCount('invoices', 11);
        
        $downPaymentInvoice = Invoice::where('invoice_number', 'INV-DP-CTR-001')->first();
        $this->assertNotNull($downPaymentInvoice);
        $this->assertEquals(20000, $downPaymentInvoice->amount);

        $installmentInvoice = Invoice::where('invoice_number', 'INV-INST-CTR-001-1')->first();
        $this->assertNotNull($installmentInvoice);
        // (100000 - 20000) / 10 = 8000
        $this->assertEquals(8000, $installmentInvoice->amount);

        // 4. Assert - Commission
        // 2% of 100000 = 2000
        $this->assertDatabaseCount('commissions', 1);
        $commission = Commission::where('sales_contract_id', $contract->id)->first();
        $this->assertNotNull($commission);
        $this->assertEquals(2000, $commission->amount);
    }
}
