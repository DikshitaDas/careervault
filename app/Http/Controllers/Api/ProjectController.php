<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects for the authenticated user.
     */
    public function index()
    {
        $projects = Project::whereHas('resume', function ($q) {
            $q->where('user_id', Auth::id());
        })->latest()->get();

        return response()->json($projects);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resume_id' => 'required|exists:resumes,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create($validator->validated());

        return response()->json($project, 201);
    }

    /**
     * Display a specific project.
     */
    public function show($id)
    {
        $project = Project::findOrFail($id);

        // Optional: check ownership
        if ($project->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($project);
    }

    /**
     * Update a project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        if ($project->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($validator->validated());

        return response()->json($project);
    }

    /**
     * Remove a project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if ($project->resume->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
