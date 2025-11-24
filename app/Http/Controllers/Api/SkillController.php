<?php

namespace App\Http\Controllers\Api;

use App\Models\Skill;
use App\Models\Resume;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class SkillController extends Controller
{
    public function __construct()
    {
        // Ensure only logged-in users can access
        $this->middleware('auth:sanctum');
    }

    /**
     *  List all skills for the authenticated user’s resume
     */
    public function index(Request $request)
    {
        $resumeId = $request->query('resume_id');

        // Ensure resume belongs to user
        $resume = Resume::where('id', $resumeId)
                        ->where('user_id', Auth::id())
                        ->firstOrFail();

        $skills = $resume->skills()->orderBy('order')->get();

        return response()->json($skills);
    }

    /**
     *  Store a new skill category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resume_id' => 'required|exists:resumes,id',
            'category' => 'required|string|max:255',
            'items' => 'required|string',
        ]);

        // Ensure resume belongs to current user
        $resume = Resume::where('id', $validated['resume_id'])
                        ->where('user_id', Auth::id())
                        ->firstOrFail();

        // Determine next order value
        $maxOrder = Skill::where('resume_id', $resume->id)->max('order') ?? 0;

        $skill = Skill::create([
            'resume_id' => $resume->id,
            'category' => $validated['category'],
            'items' => $validated['items'],
            'order' => $maxOrder + 1,
        ]);

        return response()->json($skill, 201);
    }

    /**
     * Update an existing skill category
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'items' => 'sometimes|required|string',
        ]);

        $skill = Skill::findOrFail($id);

        // Authorization check
        if ($skill->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $skill->update($validated);

        return response()->json($skill);
    }

    /**
     * Delete a skill category
     */
    public function destroy(string $id)
    {
        $skill = Skill::findOrFail($id);

        // Authorization check
        if ($skill->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully']);
    }
}
