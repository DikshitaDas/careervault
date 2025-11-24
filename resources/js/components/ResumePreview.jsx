// FILE: resources/js/components/ResumePreview.jsx
import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { NavLink } from "react-router-dom";

const THEME = {
    blue: {
        accent: "text-blue-700",
        accentBg: "bg-blue-700",
        link: "text-blue-700",
        border: "border-blue-700",
    },
    slate: {
        accent: "text-slate-800",
        accentBg: "bg-slate-800",
        link: "text-slate-800",
        border: "border-slate-700",
    },
    emerald: {
        accent: "text-emerald-700",
        accentBg: "bg-emerald-700",
        link: "text-emerald-700",
        border: "border-emerald-700",
    },
    amber: {
        accent: "text-amber-700",
        accentBg: "bg-amber-600",
        link: "text-amber-700",
        border: "border-amber-600",
    },
};

export const ResumePreview = ({
    resume,
    template = "classic",
    theme = "blue",
}) => {
    if (!resume) {
        return (
            <div className="bg-white p-6 text-center text-gray-500 text-sm">
                <p>Create or select a resume to view preview</p>
            </div>
        );
    }

    const palette = THEME[theme] || THEME.blue;

    return template === "modern" ? (
        <ModernTemplate resume={resume} palette={palette} />
    ) : (
        <ClassicTemplate resume={resume} palette={palette} />
    );
};

// Classic template (current layout, themed)
const ClassicTemplate = ({ resume, palette }) => (
    <div className="resume-page bg-white px-5 py-4 text-gray-800 font-serif text-[13px] leading-snug max-w-[210mm] mx-auto">
        {/* Header */}
        <div className="text-center pb-2 mb-3">
            <h1
                className={`text-[26px] font-extrabold mb-1 uppercase ${palette.accent}`}
            >
                {resume.title}
            </h1>
            <div className="flex justify-center gap-3 text-[11.5px] flex-wrap text-gray-600">
                {resume.email && (
                    <span className="flex items-center gap-1">
                        <Mail size={12} /> {resume.email}
                    </span>
                )}
                {resume.phone && (
                    <span className="flex items-center gap-1">
                        <Phone size={12} /> {resume.phone}
                    </span>
                )}
                {resume.location && (
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {resume.location}
                    </span>
                )}
                {resume.linkedin && (
                    <NavLink
                        to={resume.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 ${palette.link}`}
                    >
                        <Linkedin size={12} /> LinkedIn
                    </NavLink>
                )}
                {resume.github && (
                    <NavLink
                        to={resume.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 ${palette.link}`}
                    >
                        <Github size={12} /> GitHub
                    </NavLink>
                )}
            </div>
        </div>

        {/* Summary */}
        {resume.summary && (
            <Section title="Professional Summary" palette={palette}>
                <p className="text-[12.5px] leading-relaxed">
                    {resume.summary}
                </p>
            </Section>
        )}

        {/* Experience */}
        {resume.experiences?.length > 0 && (
            <Section title="Professional Experience" palette={palette}>
                {resume.experiences.map((exp) => (
                    <div key={exp.id} className="mb-1">
                        <div className="flex justify-between text-[12.5px] font-semibold">
                            <span>
                                {exp.job_title} -{" "}
                                {exp.company && (
                                    <span className="text-[12px] text-gray-500">
                                        {exp.company}
                                    </span>
                                )}
                            </span>
                            <span className="text-gray-600">
                                {formatDate(exp.start_date)} –{" "}
                                {exp.currently_working
                                    ? "Present"
                                    : formatDate(exp.end_date)}
                            </span>
                        </div>
                        {exp.description && (
                            <div
                                className="text-[12px] leading-snug ml-1 mt-0.5 resume-richtext"
                                dangerouslySetInnerHTML={{
                                    __html: exp.description,
                                }}
                            />
                        )}
                    </div>
                ))}
            </Section>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
            <Section title="Projects" palette={palette}>
                {resume.projects.map((proj) => (
                    <div key={proj.id} className="mb-1">
                        <div className="flex justify-between text-[12.5px] font-semibold">
                            <span>
                                {proj.name} -
                                {proj.technologies && (
                                    <span className="text-[12px] text-gray-500">
                                        {proj.technologies}
                                    </span>
                                )}
                            </span>
                            {proj.link && (
                                <NavLink
                                    to={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[11px] ${palette.link}`}
                                >
                                    Link
                                </NavLink>
                            )}
                        </div>
                        {proj.description && (
                            <div
                                className="text-[12px] leading-snug ml-1 mt-0.5 resume-richtext"
                                dangerouslySetInnerHTML={{
                                    __html: proj.description,
                                }}
                            />
                        )}
                    </div>
                ))}
            </Section>
        )}

        {/* Skills */}
        {resume.skills?.length > 0 && (
            <Section title="Skills" palette={palette}>
                {resume.skills.map((skill) => (
                    <p key={skill.id} className="text-[12.5px] mb-0.5">
                        <span className="font-semibold">{skill.category}:</span>{" "}
                        {skill.items}
                    </p>
                ))}
            </Section>
        )}

        {/* Education */}
        {resume.educations?.length > 0 && (
            <Section title="Education" palette={palette}>
                {resume.educations.map((edu) => {
                    const hasGrade =
                        edu.grading_type &&
                        edu.grade !== null &&
                        edu.grade !== "" &&
                        edu.grade !== undefined;

                    const gradeText = hasGrade
                        ? edu.grading_type === "percentage"
                            ? `${formatGrade(edu.grade)}%`
                            : `${formatGrade(edu.grade)} CGPA`
                        : null;

                    return (
                        <div key={edu.id} className="mb-1">
                            <div className="flex justify-between text-[12.5px] font-semibold">
                                <span>
                                    {edu.school} -{" "}
                                    <span className="text-gray-500">
                                        {edu.degree}
                                        {edu.field_of_study &&
                                        edu.field_of_study.trim() !== ""
                                            ? ` in ${edu.field_of_study}`
                                            : ""}
                                        {gradeText && ` — ${gradeText}`}
                                    </span>
                                </span>
                                <span className="text-gray-600">
                                    {edu.graduation_year}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </Section>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
            <Section title="Certifications" palette={palette}>
                {resume.certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className="flex justify-between items-center text-[12.5px] mb-1 font-semibold"
                    >
                        <span>
                            <span>{cert.name}</span> – {cert.issuer}{" "}
                            <span className="text-gray-600">
                                ({formatDate(cert.date)})
                            </span>
                        </span>
                        {cert.link && (
                            <NavLink
                                to={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[11px] ${palette.link} ml-2`}
                            >
                                Link
                            </NavLink>
                        )}
                    </div>
                ))}
            </Section>
        )}
    </div>
);

// Modern template (left header band with accent)
const ModernTemplate = ({ resume, palette }) => (
    <div className="resume-page bg-white text-gray-800 font-sans text-[13px] leading-snug max-w-[210mm] mx-auto">
        {/* Header */}
        <div className={`w-full ${palette.accentBg} text-white px-6 py-4 mb-4`}>
            <h1 className="text-[26px] font-extrabold tracking-wide">
                {resume.title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-95 text-[11.5px]">
                {resume.email && (
                    <span className="flex items-center gap-1">
                        <Mail size={12} /> {resume.email}
                    </span>
                )}
                {resume.phone && (
                    <span className="flex items-center gap-1">
                        <Phone size={12} /> {resume.phone}
                    </span>
                )}
                {resume.location && (
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {resume.location}
                    </span>
                )}
                {resume.linkedin && (
                    <NavLink
                        to={resume.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 underline"
                    >
                        <Linkedin size={12} /> LinkedIn
                    </NavLink>
                )}
                {resume.github && (
                    <NavLink
                        to={resume.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 underline"
                    >
                        <Github size={12} /> GitHub
                    </NavLink>
                )}
            </div>
        </div>

        <div className="px-6 pb-5">
            {/* Summary */}
            {resume.summary && (
                <ModernSection title="Summary" palette={palette}>
                    <p className="text-[12.5px] leading-relaxed">
                        {resume.summary}
                    </p>
                </ModernSection>
            )}

            {/* Experience */}
            {resume.experiences?.length > 0 && (
                <ModernSection title="Experience" palette={palette}>
                    {resume.experiences.map((exp) => (
                        <div key={exp.id} className="mb-2">
                            <div className="flex justify-between text-[12.5px] font-semibold">
                                <span>
                                    {exp.job_title}{" "}
                                    {exp.company && (
                                        <span className="text-[12px] text-gray-500">
                                            @ {exp.company}
                                        </span>
                                    )}
                                </span>
                                <span className="text-gray-600">
                                    {formatDate(exp.start_date)} –{" "}
                                    {exp.currently_working
                                        ? "Present"
                                        : formatDate(exp.end_date)}
                                </span>
                            </div>
                            {exp.description && (
                                <div
                                    className="text-[12px] leading-snug ml-1 mt-0.5 resume-richtext"
                                    dangerouslySetInnerHTML={{
                                        __html: exp.description,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </ModernSection>
            )}

            {/* Projects */}
            {resume.projects?.length > 0 && (
                <ModernSection title="Projects" palette={palette}>
                    {resume.projects.map((proj) => (
                        <div key={proj.id} className="mb-2">
                            <div className="flex justify-between text-[12.5px] font-semibold">
                                <span>
                                    {proj.name}{" "}
                                    {proj.technologies && (
                                        <span className="text-[12px] text-gray-500">
                                            ({proj.technologies})
                                        </span>
                                    )}
                                </span>
                                {proj.link && (
                                    <NavLink
                                        to={proj.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-[11px] ${palette.link} underline`}
                                    >
                                        Link
                                    </NavLink>
                                )}
                            </div>
                            {proj.description && (
                                <div
                                    className="text-[12px] leading-snug ml-1 mt-0.5 resume-richtext"
                                    dangerouslySetInnerHTML={{
                                        __html: proj.description,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </ModernSection>
            )}

            {/* Skills */}
            {resume.skills?.length > 0 && (
                <ModernSection title="Skills" palette={palette}>
                    {resume.skills.map((skill) => (
                        <p key={skill.id} className="text-[12.5px] mb-0.5">
                            <span className="font-semibold">
                                {skill.category}:
                            </span>{" "}
                            {skill.items}
                        </p>
                    ))}
                </ModernSection>
            )}

            {/* Education */}
            {resume.educations?.length > 0 && (
                <ModernSection title="Education" palette={palette}>
                    {resume.educations.map((edu) => {
                        const hasGrade =
                            edu.grading_type &&
                            edu.grade !== null &&
                            edu.grade !== "" &&
                            edu.grade !== undefined;

                        const gradeText = hasGrade
                            ? edu.grading_type === "percentage"
                                ? `${formatGrade(edu.grade)}%`
                                : `${formatGrade(edu.grade)} CGPA`
                            : null;

                        return (
                            <div key={edu.id} className="mb-2">
                                <div className="flex justify-between text-[12.5px] font-semibold">
                                    <span>
                                        {edu.school}{" "}
                                        <span className="text-gray-500">
                                            {edu.degree}
                                            {edu.field_of_study &&
                                            edu.field_of_study.trim() !== ""
                                                ? ` in ${edu.field_of_study}`
                                                : ""}
                                            {gradeText && ` — ${gradeText}`}
                                        </span>
                                    </span>
                                    <span className="text-gray-600">
                                        {edu.graduation_year}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </ModernSection>
            )}

            {/* Certifications */}
            {resume.certifications?.length > 0 && (
                <ModernSection title="Certifications" palette={palette}>
                    {resume.certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="flex justify-between items-center text-[12.5px] mb-1 font-semibold"
                        >
                            <span>
                                <span>{cert.name}</span> – {cert.issuer}{" "}
                                <span className="text-gray-600">
                                    ({formatDate(cert.date)})
                                </span>
                            </span>
                            {cert.link && (
                                <NavLink
                                    to={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[11px] ${palette.link} underline ml-2`}
                                >
                                    Link
                                </NavLink>
                            )}
                        </div>
                    ))}
                </ModernSection>
            )}
        </div>
    </div>
);

// Section components
const Section = ({ title, children, palette }) => (
    <div className="mb-3">
        <h2
            className={`text-[14px] font-bold uppercase border-b mb-1 pb-0.5 tracking-wide ${palette.border}`}
        >
            {title}
        </h2>
        {children}
    </div>
);

const ModernSection = ({ title, children, palette }) => (
    <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
            <div className={`h-[14px] w-[6px] ${palette.accentBg}`}></div>
            <h2
                className={`text-[14px] font-semibold tracking-wide ${palette.accent}`}
            >
                {title}
            </h2>
        </div>
        <div>{children}</div>
    </div>
);

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}
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

export default ResumePreview;
