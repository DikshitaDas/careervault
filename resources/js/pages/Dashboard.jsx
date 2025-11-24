import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="text-gray-600 mb-6">Welcome back! Start by creating or editing a resume.</p>
                <div className="flex gap-3">
                    <Link to="/resumes" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded">My Resumes</Link>
                    <Link to="/resume-builder" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Resume</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

