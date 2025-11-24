// FILE: resources/js/components/ExperienceForm.jsx
import React, { useState } from "react";
import { Trash2, Plus, Edit, Save } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export const ExperienceForm = ({
    experiences = [],
    resumeId,
    onAdd,
    onUpdate,
    onDelete,
}) => {
    const [formData, setFormData] = useState({
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        description: "",
    });

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // ReactQuill description handler
    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));

        if (errors.description) {
            setErrors((prev) => ({ ...prev, description: "" }));
        }
    };

    const resetForm = () => {
        setFormData({
            job_title: "",
            company: "",
            start_date: "",
            end_date: "",
            currently_working: false,
            description: "",
        });
        setEditMode(false);
        setEditId(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.job_title.trim()) {
            newErrors.job_title = "Job title is required";
        }
        if (!formData.company.trim()) {
            newErrors.company = "Company name is required";
        }
        if (!formData.start_date) {
            newErrors.start_date = "Start date is required";
        }

        // strip HTML from quill content
        const plainDesc = formData.description
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();

        if (!plainDesc) {
            newErrors.description = "Description is required";
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

        const payload = {
            ...formData,
            resume_id: resumeId,
        };

        if (editMode) {
            onUpdate(editId, payload);
        } else {
            onAdd(payload);
        }

        resetForm();
    };

    const handleEdit = (exp) => {
        setFormData({
            job_title: exp.job_title || "",
            company: exp.company || "",
            start_date: exp.start_date?.split("T")[0] || "",
            end_date: exp.end_date?.split("T")[0] || "",
            currently_working: !!exp.currently_working,
            description: exp.description || "",
        });
        setEditMode(true);
        setEditId(exp.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Professional Experience
            </h3>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            placeholder="Laravel / Full Stack Developer"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                                errors.job_title
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.job_title && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.job_title}
                            </p>
                        )}
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company *
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Karmick Solutions Pvt Ltd"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                                errors.company
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.company && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.company}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                                errors.start_date
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.start_date && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.start_date}
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            disabled={formData.currently_working}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        />
                    </div>
                </div>

                {/* Currently Working */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="currently_working"
                        name="currently_working"
                        checked={formData.currently_working}
                        onChange={handleChange}
                        className="w-4 h-4 rounded"
                    />
                    <label
                        htmlFor="currently_working"
                        className="text-sm font-medium text-gray-700"
                    >
                        Currently working here
                    </label>
                </div>

                {/* Description (ReactQuill) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <div className="rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
                        <ReactQuill
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder={`Briefly describe your role, responsibilities, tech stack, and key achievements.`}
                            theme="snow"
                            className="text-sm min-h-[100px] quill-compact bg-white"
                        />
                    </div>
                    {errors.description && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        {editMode ? (
                            <>
                                <Save size={18} /> Update Experience
                            </>
                        ) : (
                            <>
                                <Plus size={18} /> Add Experience
                            </>
                        )}
                    </button>

                    {editMode && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List */}
            <div className="space-y-3">
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    {exp.job_title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {exp.company}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(exp.start_date)}{" "}
                                    –{" "}
                                    {exp.currently_working
                                        ? "Present"
                                        : formatDate(exp.end_date)}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className="text-blue-500 hover:text-blue-700 transition"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(exp.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {/* Render Quill HTML safely */}
                        <div
                            className="text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper to format date like “Jul 2025”
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export default ExperienceForm;
