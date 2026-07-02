<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Document\Models\Document;
use App\Http\Resources\Api\V1\DocumentResource;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents.
     */
    public function index(Request $request)
    {
        $this->authorize('view_documents');
        
        $documents = Document::orderBy('created_at', 'desc')->get();
        return DocumentResource::collection($documents);
    }

    /**
     * Store a newly created document.
     */
    public function store(Request $request)
    {
        $this->authorize('create_documents');

        $validated = $request->validate([
            'documentable_id' => 'required|uuid',
            'documentable_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // Max 10MB
            'type' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,archived',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        $document = Document::create([
            'documentable_id' => $validated['documentable_id'],
            'documentable_type' => $validated['documentable_type'],
            'title' => $validated['title'],
            'file_path' => $path,
            'file_type' => $request->file('file')->getClientMimeType(),
            'file_size' => $request->file('file')->getSize(),
            'uploaded_by' => $request->user()->id,
            'type' => $validated['type'] ?? 'general',
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => new DocumentResource($document)
        ], 201);
    }

    /**
     * Download the document.
     */
    public function download(Document $document)
    {
        $this->authorize('view_documents');

        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->title);
    }
}
