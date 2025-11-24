// FILE: resources/js/components/ResumeBasicInfo.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ResumeBasicInfo = ({ resume, onChange, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...resume, [name]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={resume.title || ''}
                    onChange={handleChange}
                    placeholder="e.g., Senior Developer Resume 2024"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.title}</p>}
            </div>

            {/* Contact Information - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={resume.email || ''}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={resume.phone || ''}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={resume.location || ''}
                        onChange={handleChange}
                        placeholder="City, State"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Social Links - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LinkedIn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                    </label>
                    <input
                        type="url"
                        name="linkedin"
                        value={resume.linkedin || ''}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* GitHub */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                    </label>
                    <input
                        type="url"
                        name="github"
                        value={resume.github || ''}
                        onChange={handleChange}
                        placeholder="github.com/yourprofile"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Professional Summary */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Summary
                </label>
                <textarea
                    name="summary"
                    value={resume.summary || ''}
                    onChange={handleChange}
                    placeholder="Brief overview of your experience, key skills, and professional goals..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-vertical"
                />
            </div>
        </div>
    );
};

export default ResumeBasicInfo;






