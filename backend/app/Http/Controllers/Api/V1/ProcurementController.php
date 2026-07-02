<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Procurement\Models\Supplier;
use App\Domain\Procurement\Models\PurchaseOrder;
use App\Domain\Procurement\Models\Rfq;
use App\Domain\Procurement\Models\GoodsReceipt;
use App\Http\Resources\Api\V1\SupplierResource;
use App\Http\Resources\Api\V1\PurchaseOrderResource;
use App\Http\Resources\Api\V1\RfqResource;
use App\Http\Resources\Api\V1\GoodsReceiptResource;

class ProcurementController extends Controller
{
    /**
     * Display a listing of suppliers.
     */
    public function indexSuppliers(Request $request)
    {
        $this->authorize('view_suppliers');
        
        $suppliers = Supplier::orderBy('name', 'asc')->get();
        return SupplierResource::collection($suppliers);
    }

    /**
     * Store a newly created supplier.
     */
    public function storeSupplier(Request $request)
    {
        $this->authorize('create_suppliers');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'message' => 'Supplier created successfully',
            'supplier' => new SupplierResource($supplier)
        ], 201);
    }

    /**
     * Display purchase orders.
     */
    public function indexPurchaseOrders(Request $request)
    {
        $this->authorize('view_purchase_orders');
        
        $pos = PurchaseOrder::with(['supplier'])->orderBy('created_at', 'desc')->get();
        return PurchaseOrderResource::collection($pos);
    }

    /**
     * Store a new purchase order.
     */
    public function storePurchaseOrder(Request $request)
    {
        $this->authorize('create_purchase_orders');

        $validated = $request->validate([
            'supplier_id' => 'required|uuid|exists:suppliers,id',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'po_number' => 'required|string|max:255|unique:purchase_orders,po_number',
            'issue_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date',
            'status' => 'nullable|string|in:draft,sent,approved,partially_received,received,cancelled',
            'total_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $po = PurchaseOrder::create($validated);

        return response()->json([
            'message' => 'Purchase Order created successfully',
            'purchase_order' => new PurchaseOrderResource($po)
        ], 201);
    }

    /**
     * Record a goods receipt.
     */
    public function recordGoodsReceipt(Request $request)
    {
        $this->authorize('manage_goods_receipts');

        $validated = $request->validate([
            'purchase_order_id' => 'required|uuid|exists:purchase_orders,id',
            'receipt_number' => 'required|string|max:255|unique:goods_receipts,receipt_number',
            'receipt_date' => 'required|date',
            'received_by' => 'nullable|uuid|exists:users,id',
            'status' => 'nullable|string|in:pending,inspected,accepted,rejected',
            'notes' => 'nullable|string',
        ]);

        $receipt = GoodsReceipt::create($validated);
        
        // Normally, receiving goods would also trigger stock movements if applicable.

        return response()->json([
            'message' => 'Goods Receipt recorded successfully',
            'goods_receipt' => new GoodsReceiptResource($receipt)
        ], 201);
    }
}
