import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resumeAPI } from "../services/api";

const Resumes = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await resumeAPI.list();
                setItems(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Resumes</h1>
                <div>
                    <Link
                        to="/resume-builder"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mx-2 rounded"
                    >
                        Create Resume
                    </Link>
                    <Link
                        to="/job-search"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mx-2 rounded"
                    >
                        Seach Job
                    </Link>
                </div>
            </div>
            {items.length === 0 ? (
                <div className="bg-white p-6 rounded shadow text-gray-600">
                    No resumes yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((r) => (
                        <Link
                            key={r.id}
                            to={`/resume-builder/${r.id}`}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition"
                        >
                            <div className="font-semibold">{r.title}</div>
                            <div className="text-sm text-gray-600">
                                {r.email}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resumes;
