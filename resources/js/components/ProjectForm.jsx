// FILE: resources/js/components/ProjectForm.jsx
import React, { useState } from "react";
import {
    Trash2,
    Plus,
    Edit,
    AlertCircle,
    ExternalLink,
    Github,
} from "lucide-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export const ProjectForm = ({
    projects = [],
    resumeId,
    onAdd,
    onUpdate,
    onDelete,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        technologies: "",
        link: "",
    });

    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, description: value }));

        if (errors.description) {
            setErrors((prev) => ({ ...prev, description: "" }));
        }
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
        }

        // ✅ strip HTML from Quill content to check if it's actually empty
        const plainDesc = formData.description
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();

        if (!plainDesc) {
            newErrors.description = "Description is required";
        }

        if (formData.link && !isValidUrl(formData.link)) {
            newErrors.link = "Please enter a valid URL";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!resumeId) {
            alert("Please save your resume first");
            return;
        }

        if (editMode && editId) {
            onUpdate(editId, {
                ...formData,
                resume_id: resumeId,
            });
            setEditMode(false);
            setEditId(null);
        } else {
            onAdd({
                ...formData,
                resume_id: resumeId,
            });
        }

        setFormData({ name: "", description: "", technologies: "", link: "" });
        setShowForm(false);
        setErrors({});
    };

    const handleReset = () => {
        setFormData({ name: "", description: "", technologies: "", link: "" });
        setShowForm(false);
        setErrors({});
        setEditMode(false);
        setEditId(null);
    };

    const handleEdit = (proj) => {
        setFormData({
            name: proj.name,
            description: proj.description,
            technologies: proj.technologies,
            link: proj.link,
        });
        setShowForm(true);
        setEditMode(true);
        setEditId(proj.id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        Projects
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Showcase your best work and portfolio projects
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} /> Add Project
                    </button>
                )}
            </div>

            {/* Add / Edit Project Form */}
            {showForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                        {editMode ? "Edit Project" : "Add New Project"}
                    </h4>

                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., HR Management System"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                errors.name
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Project Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Link (GitHub/Demo)
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 text-gray-400">
                                <Github size={18} />
                            </div>
                            <input
                                type="url"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="https://github.com/username/project"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    errors.link
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>
                        {errors.link && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.link}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Include https:// in the URL
                        </p>
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technologies Used
                        </label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="Laravel, Livewire, Tailwind CSS, MySQL"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate technologies with commas
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description & Key Features *
                        </label>

                        <div className="rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
                            <ReactQuill
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder={`Full-stack HRMS with attendance, leave, and role-based access control
• Built with Laravel, Livewire, Tailwind CSS
• Real-time validations and secure CRUD operations`}
                                theme="snow"
                                className="text-sm min-h-[120px] quill-compact"
                            />
                        </div>
                        {errors.description && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle size={14} /> {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            {editMode ? (
                                <>
                                    <Edit size={18} /> Update Project
                                </>
                            ) : (
                                <>
                                    <Plus size={18} /> Add Project
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Projects List */}
            {projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ExternalLink
                        size={40}
                        className="mx-auto text-gray-400 mb-3"
                    />
                    <p className="text-gray-600 mb-2">No projects added yet</p>
                    <p className="text-gray-500 text-sm mb-4">
                        Add your projects to showcase your portfolio
                    </p>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                        >
                            Add Your First Project
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((proj, index) => (
                        <div
                            key={proj.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white flex justify-between items-center">
                                <h4 className="font-bold text-lg">
                                    {proj.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(proj)}
                                        className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition"
                                        title="Edit project"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(proj.id)}
                                        className="bg-red-600 hover:bg-red-700 rounded-lg p-2 transition"
                                        title="Delete project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 py-4 space-y-3">
                                {/* Technologies */}
                                {proj.technologies && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-1">
                                            TECHNOLOGIES
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.technologies
                                                .split(",")
                                                .map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                        DESCRIPTION
                                    </p>
                                    <div
                                        className="text-sm text-gray-700 leading-relaxed resume-richtext"
                                        dangerouslySetInnerHTML={{
                                            __html: proj.description,
                                        }}
                                    />
                                </div>

                                {/* Link */}
                                {proj.link && (
                                    <a
                                        href={proj.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
                                    >
                                        <ExternalLink size={16} /> View Project
                                    </a>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs text-gray-600">
                                <span>Project #{index + 1}</span>
                                {proj.created_at && (
                                    <span>
                                        {new Date(
                                            proj.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Another Button */}
            {projects.length > 0 && !showForm && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} /> Add Another Project
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectForm;
