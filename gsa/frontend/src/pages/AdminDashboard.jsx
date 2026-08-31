import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Users, FileText, Bookmark as BookmarkIcon, Flag, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
    const adminString = localStorage.getItem('admin');
    const admin = adminString ? JSON.parse(adminString) : null;
    const [stats, setStats] = useState({
        totalSchemes: 0,
        centralSchemes: 0,
        stateSchemes: 0,
        users: 0
    });

    if (!admin) return <Navigate to="/admin-login" />;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [schRes, usrRes] = await Promise.all([
                api.get('/schemes'),
                api.get('/users')
            ]);

            const schemes = schRes.data;
            setStats({
                totalSchemes: schemes.length,
                centralSchemes: schemes.filter(s => s.government === 'Central').length,
                stateSchemes: schemes.filter(s => s.government === 'Andhra Pradesh').length,
                users: usrRes.data.length
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fade-in max-w-7xl mx-auto pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-textMain">Admin Dashboard</h1>
                    <p className="text-textMain/70 mt-1">Platform overview and statistics</p>
                </div>
                <button onClick={fetchStats} className="p-2 border rounded hover:bg-gray-50 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold mb-1">Total Schemes</p>
                            <h3 className="text-3xl font-bold">{stats.totalSchemes}</h3>
                        </div>
                        <FileText className="w-8 h-8 text-primary/40" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-accent shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold mb-1">Central & State</p>
                            <h3 className="text-xl font-bold">{stats.centralSchemes} Central <br /> {stats.stateSchemes} State</h3>
                        </div>
                        <Flag className="w-8 h-8 text-accent/40" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-semibold mb-1">Registered Users</p>
                            <h3 className="text-3xl font-bold">{stats.users}</h3>
                        </div>
                        <Users className="w-8 h-8 text-purple-500/40" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-borders overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg">Quick Access</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <Link to="/admin/schemes" className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-primary hover:bg-blue-50 transition-colors">
                            <FileText className="w-8 h-8 text-primary mb-2" />
                            <span className="font-semibold text-textMain">Manage Schemes</span>
                        </Link>
                        <Link to="/admin/users" className="flex flex-col items-center justify-center p-6 border rounded-xl hover:border-textMain hover:bg-gray-100 transition-colors">
                            <Users className="w-8 h-8 text-textMain mb-2" />
                            <span className="font-semibold text-textMain">Manage Users</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-borders overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg">System Status</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600">Database Connection</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">MONGODB ONLINE</span>
                            </li>
                            <li className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600">API Uptime</span>
                                <span className="font-mono text-sm">99.9%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
