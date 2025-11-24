// FILE: resources/js/components/ResumeBuilder.jsx
import React, { useState, useEffect, useRef } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
import html2canvas from "html2canvas-pro";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { useParams, useNavigate } from "react-router-dom";
import { Save, AlertCircle, Loader, Download, Eye } from "lucide-react";
import { useResume } from "../hooks/useResume";
import {
    resumeAPI,
    experienceAPI,
    projectAPI,
    skillAPI,
    educationAPI,
    certificationAPI,
} from "../services/api";
import ResumeBasicInfo from "./ResumeBasicInfo";
import ExperienceForm from "./ExperienceForm";
import ProjectForm from "./ProjectForm";
import SkillsForm from "./SkillsForm";
import EducationForm from "./EducationForm";
import CertificationForm from "./CertificationForm";
import ResumePreview from "./ResumePreview";

export const ResumeBuilder = () => {
    const previewRef = useRef(null);

    const { id: resumeId } = useParams();
    const navigate = useNavigate();
    const {
        resume,
        loading,
        error: fetchError,
        fetchResume,
        updateResume: apiUpdateResume,
        createResume: apiCreateResume,
    } = useResume(resumeId);

    const [formData, setFormData] = useState({
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
    });

    const [activeTab, setActiveTab] = useState("basic");
    const [template, setTemplate] = useState(
        () => localStorage.getItem("cv_template") || "classic"
    );
    const [theme, setTheme] = useState(
        () => localStorage.getItem("cv_theme") || "blue"
    );
    const [saving, setSaving] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Load resume data when fetched
    useEffect(() => {
        if (resume) {
            setFormData({
                title: resume.title || "",
                email: resume.email || "",
                phone: resume.phone || "",
                location: resume.location || "",
                linkedin: resume.linkedin || "",
                github: resume.github || "",
                summary: resume.summary || "",
            });
        }
    }, [resume]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    };

    useEffect(() => {
        try {
            localStorage.setItem("cv_template", template);
            localStorage.setItem("cv_theme", theme);
        } catch (_) {}
    }, [template, theme]);

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        try {
            if (resumeId) {
                await apiUpdateResume(resumeId, formData);
            } else {
                const newResume = await apiCreateResume(formData);
                navigate(`/resume-builder/${newResume.id}`);
            }
            showMessage("success", "Resume saved successfully!");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            showMessage(
                "error",
                err.response?.data?.message || "Error saving resume"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAddExperience = async (data) => {
        try {
            await experienceAPI.create(data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Experience added successfully!");
        } catch (err) {
            showMessage("error", "Error adding experience");
        }
    };

    const handleUpdateExperience = async (id, data) => {
        try {
            await experienceAPI.update(id, data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Experience updated successfully!");
        } catch (err) {
            showMessage("error", "Error updating experience");
        }
    };

    const handleDeleteExperience = async (id) => {
        if (
            window.confirm("Are you sure you want to delete this experience?")
        ) {
            try {
                await experienceAPI.delete(id);
                if (resumeId) {
                    await fetchResume(resumeId);
                }
                showMessage("success", "Experience deleted!");
            } catch (err) {
                showMessage("error", "Error deleting experience");
            }
        }
    };

    const handleAddProject = async (data) => {
        try {
            await projectAPI.create(data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Project added successfully!");
        } catch (err) {
            showMessage("error", "Error adding project");
        }
    };
    const handleUpdateProject = async (id, data) => {
        try {
            await projectAPI.update(id, data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Project updated successfully!");
        } catch (err) {
            showMessage("error", "Error updating project");
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await projectAPI.delete(id);
                if (resumeId) {
                    await fetchResume(resumeId);
                }
                showMessage("success", "Project deleted!");
            } catch (err) {
                showMessage("error", "Error deleting project");
            }
        }
    };

    const handleAddSkill = async (data) => {
        try {
            await skillAPI.create(data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Skill added successfully!");
        } catch (err) {
            showMessage("error", "Error adding skill");
        }
    };

    const handleUpdateSkill = async (id, data) => {
        try {
            await skillAPI.update(id, data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Skill updated successfully!");
        } catch (err) {
            showMessage("error", "Error updating skill");
        }
    };

    const handleDeleteSkill = async (id) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            try {
                await skillAPI.delete(id);
                if (resumeId) {
                    await fetchResume(resumeId);
                }
                showMessage("success", "Skill deleted!");
            } catch (err) {
                showMessage("error", "Error deleting skill");
            }
        }
    };

    const handleAddEducation = async (data) => {
        try {
            await educationAPI.create(data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Education added successfully!");
        } catch (err) {
            showMessage("error", "Error adding education");
        }
    };

    const handleUpdateEducation = async (id, data) => {
        try {
            await educationAPI.update(id, data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Education updated successfully!");
        } catch (err) {
            showMessage("error", "Error updating education");
        }
    };

    const handleDeleteEducation = async (id) => {
        if (window.confirm("Are you sure you want to delete this education?")) {
            try {
                await educationAPI.delete(id);
                if (resumeId) {
                    await fetchResume(resumeId);
                }
                showMessage("success", "Education deleted!");
            } catch (err) {
                showMessage("error", "Error deleting education");
            }
        }
    };

    const handleAddCertification = async (data) => {
        try {
            await certificationAPI.create(data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Certification added successfully!");
        } catch (err) {
            showMessage("error", "Error adding certification");
        }
    };

    const handleUpdateCertification = async (id, data) => {
        try {
            await certificationAPI.update(id, data);
            if (resumeId) {
                await fetchResume(resumeId);
            }
            showMessage("success", "Certification updated successfully!");
        } catch (err) {
            showMessage("error", "Error updating certification");
        }
    };

    const handleDeleteCertification = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this certification?"
            )
        ) {
            try {
                await certificationAPI.delete(id);
                if (resumeId) {
                    await fetchResume(resumeId);
                }
                showMessage("success", "Certification deleted!");
            } catch (err) {
                showMessage("error", "Error deleting certification");
            }
        }
    };

    const handlePrint = () => {
        if (previewRef.current) {
            const printContents = previewRef.current.innerHTML;
            const originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) {
            showMessage("error", "Preview not ready");
            return;
        }

        setPdfGenerating(true);

        try {
            // 👇 capture the actual resume page, not the outer card
            const root =
                previewRef.current.querySelector(".resume-page") ||
                previewRef.current;

            const canvas = await html2canvas(root, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                windowWidth:
                    root.scrollWidth || document.documentElement.scrollWidth,
                windowHeight:
                    root.scrollHeight || document.documentElement.scrollHeight,
            });

            const imgWidthPx = canvas.width;
            const imgHeightPx = canvas.height;

            const PDF_WIDTH = 595.28; // A4 pt
            const PDF_HEIGHT = 841.89; // A4 pt

            const pxPerPt = imgWidthPx / PDF_WIDTH;
            const pageHeightPx = Math.floor(PDF_HEIGHT * pxPerPt);

            const pdfDoc = await PDFDocument.create();

            let currentY = 0;
            while (currentY < imgHeightPx) {
                const sliceHeightPx = Math.min(
                    pageHeightPx,
                    imgHeightPx - currentY
                );

                const sliceCanvas = document.createElement("canvas");
                sliceCanvas.width = imgWidthPx;
                sliceCanvas.height = sliceHeightPx;

                const sliceCtx = sliceCanvas.getContext("2d");
                sliceCtx.drawImage(
                    canvas,
                    0,
                    currentY,
                    imgWidthPx,
                    sliceHeightPx,
                    0,
                    0,
                    imgWidthPx,
                    sliceHeightPx
                );

                const dataUrl = sliceCanvas.toDataURL("image/png", 1.0);
                const pngBytes = await fetch(dataUrl).then((res) =>
                    res.arrayBuffer()
                );
                const embeddedPng = await pdfDoc.embedPng(pngBytes);

                const pageHeightPt = sliceHeightPx / pxPerPt;
                const page = pdfDoc.addPage([PDF_WIDTH, pageHeightPt]);

                page.drawImage(embeddedPng, {
                    x: 0,
                    y: 0,
                    width: PDF_WIDTH,
                    height: pageHeightPt,
                });

                currentY += sliceHeightPx;
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            const safeTitle = (formData.title || "resume")
                .replace(/[\/\\?%*:|"<>]/g, "-")
                .trim();

            a.download = `${safeTitle || "resume"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            showMessage("success", "PDF download started");
        } catch (err) {
            console.error("PDF generation error:", err);
            showMessage("error", err?.message || "Failed to generate PDF");
        } finally {
            setPdfGenerating(false);
        }
    };

    const handleDownloadDOCX = async () => {
        const ensureHtmlDocx = () =>
            new Promise((resolve, reject) => {
                if (window.htmlDocx) return resolve();
                const script = document.createElement("script");
                script.src = "https://unpkg.com/html-docx-js/dist/html-docx.js";
                script.onload = () => resolve();
                script.onerror = () =>
                    reject(new Error("Failed to load html-docx-js"));
                document.body.appendChild(script);
            });

        const cloneNodeWithInlineStyles = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.cloneNode();
            }

            const clone = node.cloneNode(false);
            if (clone.nodeType === Node.ELEMENT_NODE) {
                const computed = window.getComputedStyle(node);
                const styleProps = [
                    "font-family",
                    "font-size",
                    "font-weight",
                    "font-style",
                    "color",
                    "background-color",
                    "text-decoration",
                    "line-height",
                    "text-align",
                    "border",
                    "border-top",
                    "border-right",
                    "border-bottom",
                    "border-left",
                    "padding",
                    "margin",
                    "display",
                    "width",
                    "box-sizing",
                ];

                const inline = styleProps
                    .map((prop) => {
                        const val = computed.getPropertyValue(prop);
                        if (!val || val === "rgba(0, 0, 0, 0)") return null;
                        return `${prop}:${val}`;
                    })
                    .filter(Boolean)
                    .join(";");

                if (inline) {
                    const existing = clone.getAttribute("style") || "";
                    clone.setAttribute(
                        "style",
                        existing ? `${existing};${inline}` : inline
                    );
                }
            }

            node.childNodes.forEach((child) => {
                clone.appendChild(cloneNodeWithInlineStyles(child));
            });

            return clone;
        };

        try {
            if (!previewRef.current) throw new Error("Preview not ready");
            await ensureHtmlDocx();

            // use the inner resume page, not the whole panel
            const rootElement =
                previewRef.current.querySelector(".resume-page") ||
                previewRef.current;

            const styledRoot = cloneNodeWithInlineStyles(rootElement);

            styledRoot.querySelectorAll("img").forEach((img) => img.remove());
            styledRoot
                .querySelectorAll("a, button, [role='button'], [role='link']")
                .forEach((el) => {
                    el.removeAttribute("onclick");
                    el.removeAttribute("href");
                });

            const title = formData.title?.trim() || "Resume";

            const html = `<!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
                body {
                font-family: Arial, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                font-size: 11pt;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                }
                .docx-wrapper {
                max-width: 800px;
                margin: 0 auto;
                }
            </style>
            </head>
            <body>
            <div class="docx-wrapper">
                ${styledRoot.outerHTML}
            </div>
            </body>
            </html>`;

            const blob = window.htmlDocx.asBlob(html);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showMessage("success", "DOCX download started");
        } catch (clientErr) {
            try {
                if (!resumeId) throw clientErr;
                const blob = await resumeAPI.exportDocx(resumeId);
                const contentType = blob?.type || "";
                if (contentType.includes("application/json")) {
                    const text = await blob.text();
                    const json = JSON.parse(text);
                    throw new Error(
                        json.message || json.error || "Server error"
                    );
                }
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${formData.title?.trim() || "resume"}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                showMessage("success", "DOCX download started");
            } catch (serverErr) {
                showMessage(
                    "error",
                    serverErr?.message ||
                        clientErr?.message ||
                        "Error generating DOCX"
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="animate-spin text-blue-600" size={40} />
                    <p className="text-gray-600">Loading resume...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "basic", label: "Personal Info" },
        { id: "experience", label: "Experience" },
        { id: "projects", label: "Projects" },
        { id: "skills", label: "Skills" },
        { id: "education", label: "Education" },
        { id: "certifications", label: "Certifications" },
    ];

    const previewData = {
        ...formData,
        experiences: resume?.experiences || [],
        projects: resume?.projects || [],
        skills: resume?.skills || [],
        educations: resume?.educations || [],
        certifications: resume?.certifications || [],
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Resume Builder
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            {resumeId
                                ? `Editing: ${formData.title}`
                                : "Create your professional resume"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {/* Template selector */}
                        <div className="hidden md:flex items-center gap-2 mr-2">
                            <label className="text-sm text-gray-600">
                                Template
                            </label>
                            <select
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="classic">Classic</option>
                                <option value="modern">Modern</option>
                            </select>
                        </div>
                        {/* Theme selector */}
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            <label className="text-sm text-gray-600">
                                Theme
                            </label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="blue">Blue</option>
                                <option value="slate">Slate</option>
                                <option value="emerald">Emerald</option>
                                <option value="amber">Amber</option>
                            </select>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                        >
                            🖨️ Print
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={pdfGenerating}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                        >
                            <Download size={18} />
                            {pdfGenerating ? "Generating..." : "PDF"}
                        </button>
                        <button
                            onClick={handleDownloadDOCX}
                            disabled={!resumeId}
                            className="bg-amber-600 bg-amber-700  disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                        >
                            <Download size={18} />
                            DOCX
                        </button>
                        <button
                            onClick={() =>
                                setShowPreviewModal(!showPreviewModal)
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                        >
                            <Eye size={18} />
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {message.text && (
                <div
                    className={`${
                        message.type === "success"
                            ? "bg-green-100 border-green-400 text-green-700"
                            : message.type === "error"
                            ? "bg-red-100 border-red-400 text-red-700"
                            : "bg-blue-100 border-blue-400 text-blue-700"
                    } border-l-4 p-4 mx-4 mt-4 flex items-center gap-2 rounded`}
                >
                    <AlertCircle size={20} />
                    {message.text}
                </div>
            )}

            {fetchError && (
                <div className="bg-red-100 border-red-400 text-red-700 border-l-4 p-4 mx-4 mt-4 flex items-center gap-2 rounded">
                    <AlertCircle size={20} />
                    {fetchError}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 px-4 pb-12">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="bg-white rounded-t-lg shadow overflow-x-auto">
                        <div className="flex border-b">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 font-medium whitespace-nowrap transition text-sm ${
                                        activeTab === tab.id
                                            ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white shadow rounded-b-lg p-6">
                        {activeTab === "basic" && (
                            <ResumeBasicInfo
                                resume={formData}
                                onChange={setFormData}
                                errors={errors}
                            />
                        )}
                        {activeTab === "experience" && (
                            <ExperienceForm
                                experiences={resume?.experiences || []}
                                resumeId={resumeId}
                                onAdd={handleAddExperience}
                                onDelete={handleDeleteExperience}
                                onUpdate={handleUpdateExperience}
                            />
                        )}
                        {activeTab === "projects" && (
                            <ProjectForm
                                projects={resume?.projects || []}
                                resumeId={resumeId}
                                onAdd={handleAddProject}
                                onDelete={handleDeleteProject}
                                onUpdate={handleUpdateProject}
                            />
                        )}
                        {activeTab === "skills" && (
                            <SkillsForm
                                skills={resume?.skills || []}
                                resumeId={resumeId}
                                onAdd={handleAddSkill}
                                onDelete={handleDeleteSkill}
                                onUpdate={handleUpdateSkill}
                            />
                        )}
                        {activeTab === "education" && (
                            <EducationForm
                                educations={resume?.educations || []}
                                resumeId={resumeId}
                                onAdd={handleAddEducation}
                                onDelete={handleDeleteEducation}
                                onUpdate={handleUpdateEducation}
                            />
                        )}
                        {activeTab === "certifications" && (
                            <CertificationForm
                                certifications={resume?.certifications || []}
                                resumeId={resumeId}
                                onAdd={handleAddCertification}
                                onDelete={handleDeleteCertification}
                                onUpdate={handleUpdateCertification}
                            />
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow overflow-hidden sticky top-24">
                        <div className="bg-gray-800 text-white p-4">
                            <h2 className="text-lg font-semibold">
                                Live Preview
                            </h2>
                            <p className="text-gray-300 text-sm">
                                ATS-Optimized
                            </p>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-gray-50">
                            <div className="p-3">
                                <div
                                    ref={previewRef}
                                    className="bg-white border border-gray-300 rounded p-4 text-xs leading-relaxed"
                                    style={{ fontSize: "10px" }}
                                >
                                    <ResumePreview
                                        resume={previewData}
                                        template={template}
                                        theme={theme}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Full Preview</h2>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-8">
                            <ResumePreview
                                resume={previewData}
                                template={template}
                                theme={theme}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Print / compact styles */}
            <style>
                {`
                /* Compact A4 layout for preview + print */
                #resume-preview {
                    width: 210mm !important;
                    min-height: 297mm !important;
                    margin: 0 auto !important;
                    padding: 12mm 15mm !important;   /* ⬅ clean A4 margins */
                    font-size: 11.5px !important;
                    line-height: 1.3 !important;
                    background: white !important;
                    box-shadow: none !important;
                }

                /* Global spacing inside preview */
                #resume-preview * {
                    margin-top: 1px !important;
                    margin-bottom: 1px !important;
                }

                /* Headings more compact */
                #resume-preview h1 {
                    font-size: 20px !important;   /* override 26px Tailwind */
                    margin: 2px 0 !important;
                    line-height: 1.15 !important;
                }

                #resume-preview h2 {
                    font-size: 13px !important;
                    margin: 2px 0 !important;
                    line-height: 1.2 !important;
                }

                #resume-preview h3,
                #resume-preview h4 {
                    font-size: 12px !important;
                    margin: 2px 0 !important;
                    line-height: 1.2 !important;
                }

                #resume-preview p,
                #resume-preview li,
                #resume-preview span,
                #resume-preview div {
                    font-size: 11.5px !important;
                }

                #resume-preview p,
                #resume-preview li {
                    margin: 1px 0 !important;
                }

                /* Ensure colors print correctly */
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }

                /* Disable clickable links in print/preview */
                #resume-preview a,
                #resume-preview [role="link"] {
                    pointer-events: none !important;
                    text-decoration: none !important;
                }

                /* Rich text lists */
                .resume-richtext ul {
                    list-style-type: disc;
                    margin-left: 1.1rem;
                    padding-left: 0.1rem;
                }

                .resume-richtext ol {
                    list-style-type: decimal;
                    margin-left: 1.1rem;
                    padding-left: 0.1rem;
                }

                .resume-richtext li {
                    margin-bottom: 0.1rem;
                }

                /* Actual resume page wrapper (used for PDF capture too) */
                .resume-page {
                    width: 210mm;
                    min-height: auto;
                    margin: 0 auto;
                    padding: 12mm 15mm !important;   /* ⬅ same inner page margins */
                    background: white;
                }

                /* Print-only layout */
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .resume-page, .resume-page * {
                        visibility: visible;
                    }
                    .resume-page {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 12mm 15mm !important;  /* ⬅ print margins */
                    }
                }
            `}
            </style>
        </div>
    );
};

export default ResumeBuilder;
