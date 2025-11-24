<?php

namespace App\Http\Controllers\Api;

use App\Models\Experience;
use App\Models\Resume;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class ExperienceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resume_id' => 'required|exists:resumes,id',
            'job_title' => 'required|string',
            'company' => 'required|string',
            'start_date' => 'required',
            'end_date' => 'nullable',
            'currently_working' => 'boolean',
            'description' => 'required|string'
        ]);

        // Normalize date inputs like "12/2019" to Y-m-d
        $validated['start_date'] = $this->normalizeDate($validated['start_date']);
        if (! empty($validated['end_date'])) {
            $validated['end_date'] = $this->normalizeDate($validated['end_date']);
        }

        $resume = Resume::findOrFail($validated['resume_id']);
        $this->authorize('update', $resume);

        $experience = Experience::create($validated);
        return response()->json($experience, 201);
    }

    public function update(Request $request, Experience $experience)
    {
        $this->authorize('update', $experience->resume);

        $validated = $request->validate([
            'job_title' => 'string',
            'company' => 'string',
            'start_date' => 'sometimes',
            'end_date' => 'nullable',
            'currently_working' => 'boolean',
            'description' => 'string'
        ]);

        if (array_key_exists('start_date', $validated)) {
            $validated['start_date'] = $this->normalizeDate($validated['start_date']);
        }
        if (array_key_exists('end_date', $validated) && ! empty($validated['end_date'])) {
            $validated['end_date'] = $this->normalizeDate($validated['end_date']);
        }

        $experience->update($validated);
        return response()->json($experience);
    }

    public function destroy(Experience $experience)
    {
        $this->authorize('delete', $experience->resume);
        $experience->delete();

        return response()->json(null, 204);
    }

    private function normalizeDate(string $value): string
    {
        $formats = ['Y-m-d', 'm/d/Y', 'd/m/Y', 'Y/m/d', 'm-Y', 'm/Y', 'Y-m'];
        foreach ($formats as $format) {
            try {
                $dt = Carbon::createFromFormat($format, $value);
                if (in_array($format, ['m-Y', 'm/Y', 'Y-m'])) {
                    $dt = $dt->startOfMonth();
                }
                return $dt->toDateString();
            } catch (\Throwable $e) {
                // try next format
            }
        }
        try {
            return Carbon::parse($value)->toDateString();
        } catch (\Throwable $e) {
            abort(422, "Invalid date format: {$value}");
        }
    }
}
