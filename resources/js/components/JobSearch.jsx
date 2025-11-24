import React, { useEffect, useMemo, useState } from "react";

const JobSearch = () => {
    const pageSize = 10; // must match server-side page size (or at least the number you expect)
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        location: "",
        salary: "",
        type: "",
        site: "",
    });

    const [masterData, setMasterData] = useState({
        jobSites: [],
        designations: [],
        jobTypes: [],
        experiences: [],
        locations: [],
        salaries: [],
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [lastBatchCount, setLastBatchCount] = useState(0);

    // Fetch master data once
    useEffect(() => {
        fetch("/api/job-master-data")
            .then((res) => res.json())
            .then((data) => setMasterData(data))
            .catch((err) => console.error("Failed to fetch master data:", err));
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Utilities
    const selectedSiteHost = useMemo(() => {
        const chosen = masterData.jobSites.find(
            (s) => s.name === formData.site
        );
        if (!chosen) return "";
        try {
            return new URL(chosen.url).host;
        } catch (e) {
            return "";
        }
    }, [formData.site, masterData.jobSites]);

    const performSearch = async (reset = false, pageParam = null) => {
        setLoading(true);
        setError("");
        try {
            const effectivePage = pageParam ?? (reset ? 1 : page);
            const params = new URLSearchParams({
                ...formData,
                page: String(effectivePage),
            });
            const data = await jobSearchAPI.search(Object.fromEntries(params));

            let jobs = data.jobs || [];

            // client-side additional filtering (server already supports site filter but we keep this for safety)
            if (formData.site && selectedSiteHost) {
                jobs = jobs.filter((j) => {
                    try {
                        const host = j.apply_link
                            ? new URL(j.apply_link).host
                            : "";
                        return host.includes(selectedSiteHost);
                    } catch (e) {
                        return false;
                    }
                });
            }

            setResults((prev) => (reset ? jobs : [...prev, ...jobs]));
            setLastBatchCount(jobs.length);
        } catch (err) {
            setError("Could not load jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Submit search query
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPage(1);
        setResults([]);
        await performSearch(true, 1);
    };

    const handleLoadMore = async () => {
        const next = page + 1;
        setPage(next);
        await performSearch(false, next);
    };

    const handleClear = () => {
        setFormData({
            role: "",
            experience: "",
            location: "",
            salary: "",
            type: "",
            site: "",
        });
        setResults([]);
        setPage(1);
        setError("");
        setLastBatchCount(0);
    };

    const canLoadMore = !loading && lastBatchCount >= pageSize;

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Job Search
                </h2>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-sm px-3 py-2 rounded border text-gray-700 hover:bg-gray-50"
                >
                    Clear Filters
                </button>
            </div>

            {/* Search Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
            >
                {/* Role */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Role</option>
                        {masterData.designations.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Experience */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                        Experience
                    </label>
                    <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Experience</option>
                        {masterData.experiences.map((exp) => (
                            <option key={exp.id} value={exp.level}>
                                {exp.level} ({exp.min_years}-{exp.max_years}{" "}
                                yrs)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                        Location
                    </label>
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Location</option>
                        {masterData.locations.map((loc) => (
                            <option key={loc.id} value={loc.city}>
                                {loc.city}, {loc.country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Salary */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Salary</label>
                    <select
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Salary Range (LPA)</option>
                        {masterData.salaries.map((sal) => {
                            const lpa = (n) => Math.round((n || 0) / 100000);
                            const label = `${lpa(sal.min_salary)}-${lpa(
                                sal.max_salary
                            )} LPA`;
                            return (
                                <option key={sal.id} value={sal.min_salary}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Job Type */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                        Job Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Job Type</option>
                        {masterData.jobTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Job Site */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                        Job Site
                    </label>
                    <select
                        name="site"
                        value={formData.site || ""}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Any Site</option>
                        {masterData.jobSites.map((s) => (
                            <option key={s.id} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="col-span-full md:col-span-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && (
                <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {/* Results Section */}
            <div className="grid gap-4">
                {loading && results.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="p-4 border rounded-lg animate-pulse"
                            >
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="text-sm text-gray-600">
                            {results.length} result(s)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((job) => (
                                <div
                                    key={
                                        job.job_id ??
                                        job.apply_link ??
                                        job.title
                                    }
                                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {job.title}
                                    </h3>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {job.company} • {job.location}
                                    </div>
                                    <p className="text-gray-600 mt-2 line-clamp-3">
                                        {job.description}
                                    </p>
                                    <p className="text-gray-700 mt-2 font-medium">
                                        {job.salary}
                                    </p>
                                    <a
                                        href={job.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 mt-3 inline-block hover:underline"
                                    >
                                        Apply on {job.site}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={!canLoadMore}
                                className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-60"
                            >
                                {loading
                                    ? "Loading..."
                                    : canLoadMore
                                    ? "Load more"
                                    : "No more results"}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center">
                        No results yet. Try searching!
                    </p>
                )}
            </div>
        </div>
    );
};

export default JobSearch;
