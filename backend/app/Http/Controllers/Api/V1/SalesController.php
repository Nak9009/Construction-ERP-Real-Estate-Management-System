<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Sales\Models\Lead;
use App\Domain\Sales\Models\Quotation;
use App\Domain\Sales\Models\Reservation;
use App\Domain\Sales\Models\Booking;
use App\Domain\Sales\Models\SalesContract;
use App\Domain\Sales\Models\Commission;
use App\Http\Resources\Api\V1\LeadResource;
use App\Http\Resources\Api\V1\QuotationResource;
use App\Http\Resources\Api\V1\ReservationResource;
use App\Http\Resources\Api\V1\BookingResource;
use App\Http\Resources\Api\V1\SalesContractResource;
use App\Http\Resources\Api\V1\CommissionResource;

class SalesController extends Controller
{
    /**
     * Display a listing of leads.
     */
    public function indexLeads(Request $request)
    {
        $this->authorize('view_leads');
        
        $leads = Lead::orderBy('created_at', 'desc')->get();
        return LeadResource::collection($leads);
    }

    /**
     * Store a newly created lead.
     */
    public function storeLead(Request $request)
    {
        $this->authorize('create_leads');

        $validated = $request->validate([
            'customer_id' => 'nullable|uuid|exists:customers,id',
            'first_name' => 'required_without:customer_id|string|max:255',
            'last_name' => 'required_without:customer_id|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:new,contacted,qualified,lost,converted',
            'assigned_to' => 'nullable|uuid|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create($validated);

        return response()->json([
            'message' => 'Lead created successfully',
            'lead' => new LeadResource($lead)
        ], 201);
    }

    /**
     * Store a quotation.
     */
    public function storeQuotation(Request $request)
    {
        $this->authorize('create_quotations');

        $validated = $request->validate([
            'lead_id' => 'nullable|uuid|exists:leads,id',
            'customer_id' => 'nullable|uuid|exists:customers,id',
            'house_id' => 'nullable|uuid|exists:houses,id',
            'lot_id' => 'nullable|uuid|exists:lots,id',
            'quotation_number' => 'required|string|unique:quotations,quotation_number',
            'total_amount' => 'required|numeric|min:0',
            'valid_until' => 'required|date',
            'status' => 'nullable|string|in:draft,sent,accepted,rejected,expired',
        ]);

        $quotation = Quotation::create($validated);

        return response()->json([
            'message' => 'Quotation created successfully',
            'quotation' => new QuotationResource($quotation)
        ], 201);
    }

    /**
     * Store a reservation.
     */
    public function storeReservation(Request $request)
    {
        $this->authorize('create_reservations');

        $validated = $request->validate([
            'customer_id' => 'required|uuid|exists:customers,id',
            'house_id' => 'nullable|uuid|exists:houses,id',
            'lot_id' => 'nullable|uuid|exists:lots,id',
            'reservation_fee' => 'required|numeric|min:0',
            'reservation_date' => 'required|date',
            'valid_until' => 'required|date',
            'status' => 'nullable|string|in:active,expired,converted,cancelled',
        ]);

        $reservation = Reservation::create($validated);

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => new ReservationResource($reservation)
        ], 201);
    }

    /**
     * Store a booking.
     */
    public function storeBooking(Request $request)
    {
        $this->authorize('create_bookings');

        $validated = $request->validate([
            'customer_id' => 'required|uuid|exists:customers,id',
            'reservation_id' => 'nullable|uuid|exists:reservations,id',
            'house_id' => 'nullable|uuid|exists:houses,id',
            'lot_id' => 'nullable|uuid|exists:lots,id',
            'booking_number' => 'required|string|unique:bookings,booking_number',
            'booking_fee' => 'required|numeric|min:0',
            'booking_date' => 'required|date',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => new BookingResource($booking)
        ], 201);
    }

    /**
     * Create a sales contract.
     */
    public function storeContract(Request $request)
    {
        $this->authorize('create_sales_contracts');

        $validated = $request->validate([
            'booking_id' => 'required|uuid|exists:bookings,id',
            'customer_id' => 'required|uuid|exists:customers,id',
            'contract_number' => 'required|string|unique:sales_contracts,contract_number',
            'total_price' => 'required|numeric|min:0',
            'signed_date' => 'nullable|date',
            'status' => 'nullable|string|in:draft,signed,active,completed,terminated',
            'terms' => 'nullable|string',
        ]);

        $contract = SalesContract::create($validated);

        return response()->json([
            'message' => 'Sales contract created successfully',
            'contract' => new SalesContractResource($contract)
        ], 201);
    }

    /**
     * Record a commission.
     */
    public function storeCommission(Request $request)
    {
        $this->authorize('manage_commissions');

        $validated = $request->validate([
            'sales_contract_id' => 'required|uuid|exists:sales_contracts,id',
            'agent_id' => 'required|uuid|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'nullable|string|in:pending,approved,paid,cancelled',
            'notes' => 'nullable|string',
        ]);

        $commission = Commission::create($validated);

        return response()->json([
            'message' => 'Commission recorded successfully',
            'commission' => new CommissionResource($commission)
        ], 201);
    }
}
