// FILE: resources/js/components/CertificationForm.jsx
import React, { useState } from "react";
import { Trash2, Plus, Edit, Save } from "lucide-react";

export const CertificationForm = ({
    certifications = [],
    resumeId,
    onAdd,
    onDelete,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        issuer: "",
        date: "",
        link: "",
    });

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // 🧩 Handles field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✏️ Load certification into form for editing
    const handleEdit = (cert) => {
        setFormData({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date?.slice(0, 7) || "", // Ensure YYYY-MM for <input type="month">
            link: cert.link || "",
        });
        setEditMode(true);
        setEditId(cert.id);
    };

    // 💾 Submit form (add or update)
    const handleSubmit = (e) => {
        e.preventDefault();

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

        setFormData({ name: "", issuer: "", date: "", link: "" });
    };

    // 🗓️ Format for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Certifications
                </h3>
            </div>

            {/* 🧾 Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="AWS Solutions Architect"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuing Organization *
                    </label>
                    <input
                        type="text"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="Amazon Web Services"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Obtained *
                        </label>
                        <input
                            type="month"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Credential URL
                        </label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://aws.amazon.com/..."
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
                            <Save size={18} /> Update Certification
                        </>
                    ) : (
                        <>
                            <Plus size={18} /> Add Certification
                        </>
                    )}
                </button>
            </form>

            {/* 🗂️ List */}
            <div className="space-y-3">
                {certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    {cert.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {cert.issuer}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(cert.date)}
                                </p>
                                {cert.link && (
                                    <p className="text-sm text-blue-600 mt-1 truncate">
                                        {cert.link}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(cert)}
                                    className="text-blue-500 hover:text-blue-700 transition"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(cert.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificationForm;
