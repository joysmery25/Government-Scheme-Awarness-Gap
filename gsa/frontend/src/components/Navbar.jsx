import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userString = localStorage.getItem('user');
    const adminString = localStorage.getItem('admin');

    const user = userString ? JSON.parse(userString) : null;
    const admin = adminString ? JSON.parse(adminString) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        navigate('/');
        setIsOpen(false);
    };

    const NavLinks = () => (
        <>
            <Link to="/" className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'text-primary font-bold' : 'text-textMain hover:text-primary'}`}>Home</Link>
            <Link to="/schemes" className={`px-3 py-2 rounded-md ${location.pathname === '/schemes' ? 'text-primary font-bold' : 'text-textMain hover:text-primary'}`}>Schemes</Link>
            <Link to="/eligibility" className={`px-3 py-2 rounded-md ${location.pathname === '/eligibility' ? 'text-primary font-bold' : 'text-textMain hover:text-primary'}`}>Eligibility Checker</Link>
            <Link to="/about" className={`px-3 py-2 rounded-md ${location.pathname === '/about' ? 'text-primary font-bold' : 'text-textMain hover:text-primary'}`}>About</Link>
            <Link to="/contact" className={`px-3 py-2 rounded-md ${location.pathname === '/contact' ? 'text-primary font-bold' : 'text-textMain hover:text-primary'}`}>Contact</Link>
        </>
    );

    return (
        <nav className="bg-white border-b border-borders sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-extrabold text-primary flex items-center gap-2">
                                <Shield className="w-8 h-8 text-accent" />
                                GovScheme Portal
                            </span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            <NavLinks />
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {admin ? (
                            <>
                                <Link to="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Dashboard</Link>
                                <Link to="/admin/schemes" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Schemes</Link>
                                <Link to="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Users</Link>
                                <button onClick={handleLogout} className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">Logout</button>
                            </>
                        ) : user ? (
                            <>
                                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Dashboard</Link>
                                <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Profile</Link>
                                <Link to="/bookmarks" className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary">Bookmarks</Link>
                                <button onClick={handleLogout} className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">User Login</Link>
                                <Link to="/register" className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">Register</Link>
                                <Link to="/admin-login" className="px-4 py-2 bg-textMain text-white rounded-md hover:bg-black transition-colors">Admin Login</Link>
                            </>
                        )}
                    </div>
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-textMain hover:text-primary p-2">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden pb-4 px-4 bg-white shadow-lg space-y-2">
                    <div className="flex flex-col space-y-2">
                        <NavLinks />
                    </div>
                    <div className="border-t border-borders pt-4 flex flex-col space-y-2">
                        {admin ? (
                            <>
                                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="px-3 py-2">Admin Dashboard</Link>
                                <Link to="/admin/schemes" onClick={() => setIsOpen(false)} className="px-3 py-2">Manage Schemes</Link>
                                <Link to="/admin/users" onClick={() => setIsOpen(false)} className="px-3 py-2">Manage Users</Link>
                                <button onClick={handleLogout} className="px-3 py-2 text-left text-red-500">Logout</button>
                            </>
                        ) : user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-3 py-2">Dashboard</Link>
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="px-3 py-2">Profile</Link>
                                <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="px-3 py-2">Bookmarks</Link>
                                <button onClick={handleLogout} className="px-3 py-2 text-left text-red-500">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary font-medium">User Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary font-medium">Register</Link>
                                <Link to="/admin-login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-textMain font-medium">Admin Login</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
