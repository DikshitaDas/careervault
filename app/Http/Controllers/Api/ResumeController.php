<?php

namespace App\Http\Controllers\Api;

use App\Models\Resume;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ResumeResource;
use Symfony\Component\HttpFoundation\StreamedResponse;

// DOCX export (requires phpoffice/phpword)
// composer require phpoffice/phpword
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

class ResumeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $resumes = auth()->user()->resumes()->latest()->get();
        return ResumeResource::collection($resumes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'location' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'summary' => 'nullable|string'
        ]);

        $resume = auth()->user()->resumes()->create($validated);

        return new ResumeResource($resume);
    }

    public function show(Resume $resume)
    {
        $this->authorize('view', $resume);
        return new ResumeResource($resume->load(['experiences', 'projects', 'skills', 'educations', 'certifications']));
    }

    public function update(Request $request, Resume $resume)
    {
        $this->authorize('update', $resume);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'location' => 'nullable|string',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'summary' => 'nullable|string'
        ]);

        $resume->update($validated);

        return new ResumeResource($resume);
    }

    public function destroy(Resume $resume)
    {
        $this->authorize('delete', $resume);
        $resume->delete();

        return response()->json(null, 204);
    }

    public function exportDocx(Resume $resume)
    {
        $this->authorize('view', $resume);
        $resume->load(['experiences', 'projects', 'skills', 'educations', 'certifications']);

        if (!class_exists(\PhpOffice\PhpWord\PhpWord::class)) {
            return response()->json([
                'error' => 'DOCX export is not configured',
                'hint' => 'Run: composer require phpoffice/phpword and enable ext-zip',
            ], 500);
        }

        try {
            $phpWord = new PhpWord();
            $section = $phpWord->addSection();

        $titleStyle = ['bold' => true, 'size' => 20];
        $h2Style = ['bold' => true, 'size' => 14];
        $textStyle = ['size' => 11];

        // Header
        $section->addText($resume->title ?? 'Resume', $titleStyle);
        $headerBits = array_filter([
            $resume->email,
            $resume->phone,
            $resume->location,
            $resume->linkedin ? 'LinkedIn: '.$resume->linkedin : null,
            $resume->github ? 'GitHub: '.$resume->github : null,
        ]);
        if (!empty($headerBits)) {
            $section->addText(implode(' | ', $headerBits), ['size' => 10]);
        }

        // Summary
        if (!empty($resume->summary)) {
            $section->addTextBreak(1);
            $section->addText('Professional Summary', $h2Style);
            $section->addText($resume->summary, $textStyle);
        }

        // Experience
        if ($resume->experiences && $resume->experiences->count()) {
            $section->addTextBreak(1);
            $section->addText('Professional Experience', $h2Style);
            foreach ($resume->experiences as $exp) {
                $line = trim(($exp->job_title ?? '').' - '.($exp->company ?? ''));
                $dates = trim(($exp->start_date ? date('M Y', strtotime($exp->start_date)) : '').' – '.($exp->currently_working ? 'Present' : ($exp->end_date ? date('M Y', strtotime($exp->end_date)) : '')));
                $section->addText($line, ['bold' => true]);
                if ($dates) $section->addText($dates, ['italic' => true, 'size' => 10]);
                if (!empty($exp->description)) {
                    foreach (preg_split("/(\r\n|\n|\r)/", $exp->description) as $p) {
                        if (trim($p) !== '') $section->addListItem($p, 0, $textStyle);
                    }
                }
                $section->addTextBreak(1);
            }
        }

        // Projects
        if ($resume->projects && $resume->projects->count()) {
            $section->addText('Projects', $h2Style);
            foreach ($resume->projects as $proj) {
                $line = trim(($proj->name ?? '').($proj->technologies ? ' - '.$proj->technologies : ''));
                $section->addText($line, ['bold' => true]);
                if (!empty($proj->description)) {
                    foreach (preg_split("/(\r\n|\n|\r)/", $proj->description) as $p) {
                        if (trim($p) !== '') $section->addListItem($p, 0, $textStyle);
                    }
                }
            }
            $section->addTextBreak(1);
        }

        // Skills
        if ($resume->skills && $resume->skills->count()) {
            $section->addText('Skills', $h2Style);
            foreach ($resume->skills as $skill) {
                $label = trim(($skill->category ?? '').': '.($skill->items ?? ''));
                $section->addText($label, $textStyle);
            }
            $section->addTextBreak(1);
        }

        // Education
        if ($resume->educations && $resume->educations->count()) {
            $section->addText('Education', $h2Style);
            foreach ($resume->educations as $edu) {
                $line = trim(($edu->school ?? '').' - '.($edu->degree ?? '').($edu->field_of_study ? ' in '.$edu->field_of_study : ''));
                $section->addText($line, ['bold' => true]);
                if (!empty($edu->graduation_year)) {
                    $section->addText((string)$edu->graduation_year, ['size' => 10]);
                }
            }
            $section->addTextBreak(1);
        }

            // Certifications
            if ($resume->certifications && $resume->certifications->count()) {
                $section->addText('Certifications', $h2Style);
                foreach ($resume->certifications as $cert) {
                    $when = $cert->date ? ' ('.date('M Y', strtotime($cert->date)).')' : '';
                    $line = trim(($cert->name ?? '').' – '.($cert->issuer ?? '').$when);
                    $section->addText($line, $textStyle);
                }
            }

            $filename = ($resume->title ? preg_replace('/[^A-Za-z0-9-_]+/','_', $resume->title) : 'resume').'.docx';

            return new StreamedResponse(function () use ($phpWord) {
                $writer = IOFactory::createWriter($phpWord, 'Word2007');
                $writer->save('php://output');
            }, 200, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
                'Cache-Control' => 'no-store, no-cache, must-revalidate',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Failed to generate DOCX',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
