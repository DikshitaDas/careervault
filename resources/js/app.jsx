import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeBuilder from './components/ResumeBuilder';

// Auth & Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resumes from './pages/Resumes';
import JobSearch from './components/JobSearch';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<Layout />}>
                    <Route index element={<Navigate to="/resumes" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/resumes" element={<Resumes />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="/resume-builder/:id" element={<ResumeBuilder />} />
                    <Route path="/job-search" element={<JobSearch/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}


