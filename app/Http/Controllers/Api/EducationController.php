<?php

namespace App\Http\Controllers\Api;

use App\Models\Education;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    /**
     * Display all educations belonging to the authenticated user.
     */
    public function index()
    {
        $educations = Education::whereHas('resume', function ($q) {
            $q->where('user_id', Auth::id());
        })->latest()->get();

        return response()->json($educations);
    }

    /**
     * Store a new education.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resume_id' => 'required|exists:resumes,id',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'school' => 'required|string|max:255',
            'graduation_year' => 'nullable|integer|min:1900|max:2100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $education = Education::create($validator->validated());

        return response()->json($education, 201);
    }

    /**
     * Show a specific education.
     */
    public function show($id)
    {
        $education = Education::findOrFail($id);

        if ($education->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($education);
    }

    /**
     * Update an existing education.
     */
    public function update(Request $request, $id)
    {
        $education = Education::findOrFail($id);

        if ($education->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'school' => 'required|string|max:255',
            'graduation_year' => 'nullable|integer|min:1900|max:2100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $education->update($validator->validated());

        return response()->json($education);
    }

    /**
     * Delete an education record.
     */
    public function destroy($id)
    {
        $education = Education::findOrFail($id);

        if ($education->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $education->delete();

        return response()->json(['message' => 'Education deleted successfully']);
    }
}
