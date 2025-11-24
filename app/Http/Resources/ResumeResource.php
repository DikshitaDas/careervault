<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResumeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'linkedin' => $this->linkedin,
            'github' => $this->github,
            'summary' => $this->summary,
            'is_default' => (bool) ($this->is_default ?? false),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'experiences' => ExperienceResource::collection($this->whenLoaded('experiences')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'educations' => EducationResource::collection($this->whenLoaded('educations')),
            'certifications' => CertificationResource::collection($this->whenLoaded('certifications')),
        ];
    }
}
