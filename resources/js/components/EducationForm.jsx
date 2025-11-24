// FILE: resources/js/components/EducationForm.jsx
import React, { useState } from "react";
import { Trash2, Plus, Edit } from "lucide-react";

export const EducationForm = ({
    educations = [],
    resumeId,
    onAdd,
    onDelete,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        degree: "",
        field_of_study: "",
        school: "",
        graduation_year: "",
        grading_type: "",
        grade: "",
    });

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (edu) => {
        setEditMode(true);
        setEditId(edu.id);
        setFormData({
            degree: edu.degree || "",
            field_of_study: edu.field_of_study || "",
            school: edu.school || "",
            graduation_year: edu.graduation_year || "",
            grading_type: edu.grading_type || "",
            grade:
                edu.grade === null || edu.grade === undefined
                    ? ""
                    : String(edu.grade),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // FIX:
        // Prevent wiping values during update when user leaves blank
        if (editMode) {
            const old = educations.find((e) => e.id === editId);

            if (formData.grading_type === "") {
                formData.grading_type = old?.grading_type || null;
            }

            if (formData.grade === "") {
                formData.grade = old?.grade || null;
            }
        }

        const payload = {
            ...formData,
            grading_type: formData.grading_type || null,
            grade:
                formData.grade === "" || formData.grade === null
                    ? null
                    : formData.grade,
            resume_id: resumeId,
        };

        if (editMode && editId) {
            onUpdate(editId, payload);
            setEditMode(false);
            setEditId(null);
        } else {
            onAdd(payload);
        }

        // Reset form after submit
        setFormData({
            degree: "",
            field_of_study: "",
            school: "",
            graduation_year: "",
            grading_type: "",
            grade: "",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Education
                </h3>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Degree *
                        </label>
                        <input
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            placeholder="Bachelor of Technology"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field of Study
                        </label>
                        <input
                            type="text"
                            name="field_of_study"
                            value={formData.field_of_study}
                            onChange={handleChange}
                            placeholder="Electronics & Communication"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            School/University *
                        </label>
                        <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleChange}
                            placeholder="University Name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Graduation Year
                        </label>
                        <input
                            type="number"
                            name="graduation_year"
                            value={formData.graduation_year}
                            onChange={handleChange}
                            placeholder="2025"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Grade Type + Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grade Type
                        </label>
                        <select
                            name="grading_type"
                            value={formData.grading_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">Select</option>
                            <option value="percentage">Percentage</option>
                            <option value="cgpa">CGPA</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.grading_type === "cgpa"
                                ? "CGPA"
                                : formData.grading_type === "percentage"
                                ? "Percentage"
                                : "Grade"}
                        </label>

                        <input
                            type="number"
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            placeholder={
                                formData.grading_type === "cgpa"
                                    ? "8.5"
                                    : formData.grading_type === "percentage"
                                    ? "85.5"
                                    : "e.g. 8.5 or 85.5"
                            }
                            step="0.01"
                            min="0"
                            max={
                                formData.grading_type === "percentage"
                                    ? "100"
                                    : undefined
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    {editMode ? (
                        <>
                            <Edit size={18} /> Update Education
                        </>
                    ) : (
                        <>
                            <Plus size={18} /> Add Education
                        </>
                    )}
                </button>
            </form>

            {/* List */}
            <div className="space-y-3">
                {educations.map((edu) => (
                    <div
                        key={edu.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-start"
                    >
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                {edu.school}
                            </h4>

                            <p className="text-sm text-gray-600">
                                {edu.degree}
                                {edu.field_of_study
                                    ? `, ${edu.field_of_study}`
                                    : ""}
                            </p>

                            <p className="text-xs text-gray-500">
                                {edu.graduation_year}
                                {edu.grading_type &&
                                    edu.grade !== null &&
                                    edu.grade !== undefined && (
                                        <>
                                            {" • "}
                                            {edu.grading_type === "percentage"
                                                ? `${formatGrade(edu.grade)}%`
                                                : `${formatGrade(
                                                      edu.grade
                                                  )} CGPA`}
                                        </>
                                    )}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleEdit(edu)}
                                className="text-blue-500 hover:text-blue-700 transition"
                            >
                                <Edit size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(edu.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function formatGrade(value) {
    if (value === null || value === "" || value === undefined) return "";

    // Convert to number first so JS trims .00 etc.
    const num = Number(value);

    // If integer, show as integer (75 instead of 75.0)
    if (Number.isInteger(num)) {
        return num.toString();
    }

    // Else show minimal decimal (8.5 instead of 8.50)
    return num.toString();
}

export default EducationForm;
