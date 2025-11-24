import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, FileText, Menu, X, ChevronDown, Home } from 'lucide-react';
import { useAppConfig } from '../hooks/useAppConfig';
import api from '../services/api';

export const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appName } = useAppConfig();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await api.get('/user');
                setUser(response.data);
            } catch (err) {
                console.error('Not authenticated:', err);
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('auth_token');
            window.location.href = '/logout';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo and Brand */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition"
                        >
                            <FileText size={28} className="text-blue-600" />
                            <span className="hidden sm:inline">{appName}</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            {/* Navigation Links */}
                            <Link
                                to="/resumes"
                                className={`font-medium transition flex items-center gap-1 ${
                                    isActive('/resumes')
                                        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Home size={18} />
                                My Resumes
                            </Link>

                            {/* Create Resume Button */}
                            <Link
                                to="/resume-builder"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
                            >
                                <FileText size={18} />
                                Create Resume
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden lg:inline text-sm">{user?.name}</span>
                                    <ChevronDown size={16} className={`transition ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-600">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            👤 Profile Settings
                                        </Link>

                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            ⚙️ Account Settings
                                        </a>

                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            ❓ Help & Support
                                        </a>

                                        <div className="border-t border-gray-200 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-gray-600 hover:text-gray-900"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                            <Link
                                to="/resumes"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                📋 My Resumes
                            </Link>

                            <Link
                                to="/resume-builder"
                                className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                ➕ Create Resume
                            </Link>

                            <div className="border-t border-gray-200 pt-3">
                                <p className="px-4 py-2 text-sm font-semibold text-gray-800">{user?.name}</p>
                                <p className="px-4 text-xs text-gray-600">{user?.email}</p>
                            </div>

                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                👤 Profile
                            </Link>

                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 mt-16">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <FileText size={24} className="text-blue-400" />
                                <h3 className="font-bold text-lg text-white">{appName}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Create professional resumes in minutes. Perfect for job seekers and career changers.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        to="/resumes"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        My Resumes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/resume-builder"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Create Resume
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Templates
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Tips & Tricks
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Cookie Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-sm">
                                &copy; 2024 {appName}. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition text-sm"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition text-sm"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition text-sm"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;


