import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ShieldAlert, Mail, Lock, ExternalLink } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('admin@gsa.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/admin-login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('admin', JSON.stringify(res.data.admin));
            window.location.href = '/admin/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid admin credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] fade-in">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-textMain w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-textMain"></div>
                <div className="text-center mb-8 pt-4">
                    <ShieldAlert className="w-12 h-12 text-textMain mx-auto mb-2" />
                    <h2 className="text-3xl font-extrabold text-textMain">Staff Portal</h2>
                    <p className="text-textMain/70 mt-2">Authorized personnel only</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center border border-red-200">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-textMain text-white font-bold py-3 rounded-lg hover:bg-black transition-all shadow-md">
                        Access Dashboard
                    </button>

                    <div className="mt-2 text-center text-sm text-textMain/70">
                        Don't have an admin account? <Link to="/admin-register" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">Register Here <ExternalLink className="w-3 h-3" /></Link>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-textMain/70">
                    Citizen? <Link to="/login" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">Go to Citizen Portal <ExternalLink className="w-3 h-3" /></Link>
                </div>
            </div>
        </div>
    );
}
