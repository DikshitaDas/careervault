<?php

namespace App\Http\Controllers\Api;

use App\Models\Certification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
{
    /**
     * Display a listing of the certifications for the authenticated user.
     */
    public function index()
    {
        $certifications = Certification::whereHas('resume', function ($q) {
            $q->where('user_id', Auth::id());
        })->latest()->get();

        return response()->json($certifications);
    }

    /**
     * Store a newly created certification.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resume_id' => 'required|exists:resumes,id',
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'date' => 'required|date',
            'link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $certification = Certification::create($validator->validated());

        return response()->json($certification, 201);
    }

    /**
     * Display a specific certification.
     */
    public function show($id)
    {
        $certification = Certification::findOrFail($id);

        if ($certification->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($certification);
    }

    /**
     * Update a certification.
     */
    public function update(Request $request, $id)
    {
        $certification = Certification::findOrFail($id);

        if ($certification->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'date' => 'required|date',
            'link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $certification->update($validator->validated());

        return response()->json($certification);
    }

    /**
     * Remove a certification.
     */
    public function destroy($id)
    {
        $certification = Certification::findOrFail($id);

        if ($certification->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $certification->delete();

        return response()->json(['message' => 'Certification deleted successfully']);
    }
}
