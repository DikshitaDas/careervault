<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class JobSearchController extends Controller
{
    public function index(Request $request)
    {
        //Validate query parameters
        $validated = $request->validate([
            'role' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'salary' => 'nullable|integer|min:0',
            'type' => 'nullable|string|max:100',
            'site' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
        ]);

        //Extract values
        $role = $validated['role'] ?? null;
        $location = $validated['location'] ?? null;
        $salary = $validated['salary'] ?? null;
        $type = $validated['type'] ?? null;
        $site = $validated['site'] ?? null;
        $page = (int) ($validated['page'] ?? 1);

        //API key check
        $apiKey = env('RAPIDAPI_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'RAPIDAPI_KEY not found in .env'], 500);
        }

        //Build query parameters
        $queryParams = [
            'query' => trim(($role ? $role : '') . ($location ? " in {$location}" : '')) ?: 'Software Engineer',
            'page' => max($page, 1),
            'num_pages' => 1,
        ];

        //Normalize job type
        if (!empty($type)) {
            $normalizedMap = [
                'full time' => 'FULLTIME',
                'full-time' => 'FULLTIME',
                'fulltime' => 'FULLTIME',
                'part time' => 'PARTTIME',
                'part-time' => 'PARTTIME',
                'parttime' => 'PARTTIME',
                'contract' => 'CONTRACT',
                'intern' => 'INTERN',
                'internship' => 'INTERN',
                'temporary' => 'TEMPORARY',
            ];

            $lower = strtolower($type);
            if (isset($normalizedMap[$lower])) {
                $queryParams['employment_types'] = $normalizedMap[$lower];
            }
        }

        //Salary filter
        if (!empty($salary)) {
            $queryParams['salary_min'] = (int) $salary;
        }

        try {
            //Send API request
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'X-RapidAPI-Key' => $apiKey,
                'X-RapidAPI-Host' => 'jsearch.p.rapidapi.com',
            ])->get('https://jsearch.p.rapidapi.com/search', $queryParams);

            //Handle failed response
            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch jobs',
                    'details' => $response->json() ?: $response->body(),
                ], $response->status() ?: 500);
            }

            $data = $response->json();

            //Handle empty results
            if (empty($data['data'])) {
                return response()->json(['jobs' => []]);
            }

            //Transform job data
            $results = collect($data['data'])->map(function ($job) {
                $min = $job['job_min_salary'] ?? null;
                $max = $job['job_max_salary'] ?? null;
                $currency = $job['job_salary_currency'] ?? '';

                $salaryText = $currency && ($min || $max)
                    ? "{$currency} " . ($min ?? '?') . " - " . ($max ?? '?')
                    : 'Not disclosed';

                $applyLink = $job['job_apply_link'] ?? '#';
                $host = parse_url($applyLink, PHP_URL_HOST);

                return [
                    'title' => $job['job_title'] ?? 'Unknown Position',
                    'company' => $job['employer_name'] ?? 'Unknown Company',
                    'location' => $job['job_city'] ?? 'N/A',
                    'description' => strip_tags($job['job_description'] ?? ''),
                    'apply_link' => $applyLink,
                    'site' => $host ?: ($job['employer_website'] ?? 'website'),
                    'salary' => $salaryText,
                ];
            });

            //Filter by site (optional)
            if ($site) {
                $results = $results->filter(function ($job) use ($site) {
                    return str_contains(strtolower($job['site']), strtolower($site));
                });
            }

            //Return response
            return response()->json([
                'jobs' => $results->take(10)->values(),
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Job search request error',
                'details' => $e->getMessage(),
                'exception' => get_class($e),
            ], 500);
        }
    }
}
