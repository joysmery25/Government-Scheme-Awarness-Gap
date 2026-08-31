import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { User, Mail, Lock, ShieldAlert, ExternalLink } from 'lucide-react';

export default function AdminRegister() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            // Use the unified register endpoint with role: 'Admin'
            await api.post('/auth/register', { ...formData, role: 'Admin' });
            navigate('/admin-login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] fade-in py-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-textMain w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-textMain"></div>
                <div className="text-center mb-8 pt-4">
                    <ShieldAlert className="w-12 h-12 text-textMain mx-auto mb-2" />
                    <h2 className="text-3xl font-extrabold text-textMain">Staff Registration</h2>
                    <p className="text-textMain/70 mt-2">Create authorized account</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center border border-red-200">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text" name="fullName"
                                value={formData.fullName} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-textMain mb-2">Confirm Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password" name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-borders rounded-lg outline-none focus:ring-2 focus:ring-textMain focus:border-textMain transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-textMain text-white font-bold py-3 rounded-lg hover:bg-black transition-all shadow-md">
                        Register Admin
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-textMain/70">
                    Already have an account? <Link to="/admin-login" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">Login <ExternalLink className="w-3 h-3" /></Link>
                </div>
            </div>
        </div>
    );
}
